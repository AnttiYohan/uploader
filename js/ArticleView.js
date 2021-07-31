import { WCBase, ARTICLE_URL } from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { ArticleEditor } from './ArticleEditor.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { newTagAttrsChildList } from './util/elemfactory.js';

/**
 * Article View is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Manages the articles in the BFW server
 */
class ArticleView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='popup-connector'></div>
        <div class='uploader view-node'>
            <div class='uploader__frame' data-input-frame>
                <button class='button--refresh'>Reload</button>
                <text-input-row  data-input='title' required>Title</text-input-row>
                <image-input-row data-input='image' required>Article Image</image-input-row>
                <text-input-row  data-input='description' required>Description</text-input-row>
                <text-input-area data-input='text' data-rows='24' required>Content</text-input-area>
                <number-input-row data-input='likes'>Likes</number-input-row>
                <text-input-row  data-input='mainPictureLink'>Main Image Link</text-input-row>
                <div class='uploader__row--last'>
            </div>
            <button class='button--save'>Save</button>
        </div>
        <!-- Existing articles frame -->
        <div class='uploader__frame--scroll article_list'>
           <entry-browser data-browser='article_browser' data-edit=true>Articles:</entry-browser>
        </div>
       </div>`
        );    
        
        // ---------------------------
        // - Save element references
        // ---------------------------

        const inputFrame     = this.shadowRoot.querySelector( '.uploader__frame[data-input-frame]' );
        const inputArray     = Array.from(inputFrame.querySelectorAll('[data-input]'));
        this.mInputOperator  = new InputOperator( 'article', inputArray );
        this.mEditorNode     = this.shadowRoot.querySelector( '.popup-connector' );
        this.mRootElement    = this.shadowRoot.querySelector( '.uploader' );
        this.mViewNode       = this.shadowRoot.querySelector( '.view-node' );
        this.mBrowser        = this.shadowRoot.querySelector( '[data-browser="article_browser"]' );
        const saveButton     = this.shadowRoot.querySelector( '.button--save' );
        const refreshButton  = this.shadowRoot.querySelector( '.button--refresh' );

        refreshButton.addEventListener( 'click', e => 
        { 
            FileCache.clearCache(ARTICLE_URL);
            this.loadArticles();
        });

        saveButton.addEventListener( 'click', e =>
        {
            // --------------------------------------
            // - Obtain input values and validate
            // - If dto and image file present, send
            // - To the server
            // --------------------------------------
   
            const dto = this.mInputOperator.processInputs();
            if ( ! dto ) return;

            const imageFile = this.mInputOperator.imageFile();
            
            if ( dto && imageFile )
            {
                const responseNotifier = new ResponseNotifier
                (
                    'articleDto',
                    'Create Article', 
                    'Article Created Succesfully',
                    'Article Could Not Be Created' 
                );
                this.mRootElement.appendChild( responseNotifier );
                responseNotifier.onSuccess( 
                    () => {
                        this.loadArticles();
                        this.mInputOperator.reset();
                    }
                );
                responseNotifier.onFail(
                    () => {
                        console.log(`Article could not be added to the server`)
                    }
                );
                responseNotifier.begin( FileCache.postDtoAndImage( ARTICLE_URL, dto, imageFile) );
            }
            else
            {
                console.log(`Add proper data and image file`);
            }
        });

        //this.loadProducts();
    }

    /**
     * Read Articles from cache or from server
     */
    async loadArticles()
    {
        const { ok, status, text } = await FileCache.getCached( ARTICLE_URL );

        if ( ok ) this.generateList( text );
        else
        {
            console.log(`Product read status: ${status}`);
        }
    }


    /**
     * Generates the product list
     * 
     * @param {array} list 
     */
    generateList( response )
    {
        let list = undefined;

        try
        {
            list = JSON.parse( response );
        }
        catch (error) 
        {
            console.log(`ArticleView::generateList error ${error}`);
        }

        if ( list && Array.isArray( list ) )
        { 
            const model = {
                titlekey: 'title',
                fields: [
                    'text',
                    'description',
                    'likes',
                    'mainPictureLink',
                    'authorId'
                ]
            };

            this.mBrowser.pushDataSet(list, model);    
        }
    }

    /**
     * Executes HTTP DELETE by product route / id
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    removeArticle(id)
    {
        console.log(`Remove product with  ${id} called`);
        const responseNotifier = new ResponseNotifier
        ( 
            'articleDto',
            'Remove Article', 
            'Article Removed Succesfully',
            'Article Could Not Be Removed' 
        );
        this.mRootElement.appendChild( responseNotifier );

        responseNotifier.onSuccess
        ( 
            () => {            
                this.loadArticles();
            }
        );
        responseNotifier.onFail
        (
            () => {
                console.log(`Article could not be removed`)
            }
        );
        responseNotifier.begin( FileCache.delete( ARTICLE_URL, id ) );

    }


    /**
     * Open the article editor by reading the ArticleDTO from the server
     * 
     * @param  {number} id 
     */
    async openEditorById( id )
    {
        if ( ! id ) return;

        const { status, ok, text } = await FileCache.getRequest( `${ARTICLE_URL}/${id}`, true, false );

        if ( ok )
        {
            let article = undefined;

            try 
            {
                article = JSON.parse( text );
            }
            catch ( error )
            {
                console.log( `Could not parse article: ${error}` );
            }

            if ( article )
            {
                console.table( article );
                this.mEditorNode.appendChild(

                    new ArticleEditor
                    (
                        article, 
                        this, 
                        this.mViewNode
                    )

                );
            }
        }
        else
        {
            console.log( `Could not read article from the server, status: ${status}`);
        }
    }


    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        /**
         * @listens remove-by-id
         * Initiates a HTTP DELETE /article/{id} Request
         */
        this.listen( 'remove-by-id', e => this.removeArticle( e.detail.entry.id ) );
    
        /**
         * @listens edit-by-id
         * Requests the article by the id,
         * Opens the ArticleEditor with the DTO in response
         */
        this.listen( 'edit-by-id',   e => this.openEditorById( e.detail.entry.id ) );
        
        /**
         * @listens 'article-edited
         * Realoads articles on receipt
         */
        this.listen( 'article-edited', e => this.loadArticles() );

        this.loadArticles();

    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define('article-view', ArticleView);

export { ArticleView };