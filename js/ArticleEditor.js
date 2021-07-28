import 
{
    WCBase,
    ARTICLE_URL

} from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EditorLabel } from './EditorLabel.js';
import { EditorImage } from './EditorImage.js';
import { ArticleOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';


/**
 * This is an Editor Popup for ArticleView  
 */
class ArticleEditor extends WCBase
{
    /**
     * ArticleEditor Constructor function 
     * ------
     * @param {Object}      articleDto, holds the data of selected article
     * @param {Context}     parent, article view 
     * @param {HTMLElement} viewNode, the article view root node 
     */
    constructor( articleDto, parent, viewNode )
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mArticleId         = articleDto.id;
        this.mArticleDto        = articleDto;
        this.mParentContext     = parent;
        this.mViewNode          = viewNode;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate(
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='notifier'></div>
         <div class='editor' data-input-frame>
            <div class='editor__component'>
                <editor-label data-label='title'>Current</editor-label> 
                <text-input-row data-input='title'>New Title</text-input-row>
            </div>
            <div class='editor__component'>
                <editor-image data-label='mediaDto'>Current Image</editor-image>
                <image-input-row data-input='mediaDto'>New Image</image-input-row>
            </div>
            <div class='editor__component'>
                <editor-label data-label='description'>Description</editor-label>
                <text-input-row data-input='description'>Edited</text-input-row>
            </div> 
            <div class='editor__component'>
                <editor-label    data-label='text'>Content</editor-label>
                <text-input-area data-input='text'>Edited</text-input-area>
            </div>
            <div class='editor__component'>
                <editor-label     data-label='likes'>Likes</editor-label>
                <number-input-row data-input='likes'>Edited</number-input-row>
            </div>
            <div class='editor__component'>
                <editor-label    data-label='mainImageLink'>Main Image Link</editor-label>
                <text-input-row  data-input='mainImageLink'>Edited</text-input-row>
            </div>
            <button class='button update update--one-to-one'>Update</button>
            <button class='button exit'>Exit</button>
        </div>`);

        this.setupStyle
        (`
        .button { margin: 32px auto; display: block; }
        .update--one-to-one { margin-top: 32px; margin-bottom: 42px; display: block; }
        .notifier { position: absolute; }
        .dialog { top: 1000px; z-index:1; }
        .editor { max-width: 1200px; margin: 24px auto; padding: 0; box-shadow: 0 0 4px -1px rgba(0,0,0,.25); border-radius: 24px; border: 6px solid #abd; }
        `);

        this.mRootElement    = this.shadowRoot.querySelector( '.notifier' );
        const dataInputFrame = this.shadowRoot.querySelector( '[data-input-frame]' );
        this.mInputOperator  = new InputOperator( 'article', Array.from(dataInputFrame.querySelectorAll('[data-input]')));
        this.mInputOperator.setComponentFrame( dataInputFrame );
        this.mInputOperator.loadComponents
        (
            Array.from( dataInputFrame.querySelectorAll( '.editor__component' ) ),
            articleDto
        );

        const exitButton = this.shadowRoot.querySelector( '.button.exit' );
        exitButton.addEventListener( 'click', e => this.closeEditor() );

        /**
         * HTMLElement, use this to store the clicked
         * button into it
         */
        this.mClickedButton = null;

        /**
         * Listen to update--one-to-one button
        */
        const updateButton = dataInputFrame.querySelector( '.update--one-to-one' );
        updateButton.addEventListener( 'click', e => 
        {
            /**
             * Store the reference into the clickedbutton
             */
            this.mClickedButton = updateButton;

            const image = this.mInputOperator.getUpdateImage();
            const data =  this.mInputOperator.getUpdateArticle();
            
            if ( ! data && ! image ) return;

            this.updateArticle( { 'title': 'article', data }, image );
                    
        });

    
    }

    /**
     * Updae methods for recipe 1:1 fields
     * @param   {object} dto 
     * @return 
     */
    async updateArticle( dto, image )
    {
        const serialized = image ? JSON.stringify( dto ) : null;
        const offsetTop  = Number(this.mClickedButton.offsetTop - 200);
        const offsetLeft = Number(this.mClickedButton.offsetLeft);
        const responseNotifier = new ResponseNotifier
        (
            'articleDto',
            'Update Article', 
            'Article Updated Succesfully',
            'The Article Could Not Be Updated',
            { top: `${offsetTop}px`, left: `${20}px` }
        );
        //this.mViewNode.appendChild( responseNotifier );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( article => this.mInputOperator.reloadEditor( article ) );
        responseNotifier.onFail(( status, message ) =>
            console.log( `ArticleEditor::update article fail: status ${status}, ${message}`)
        );
        responseNotifier.begin( image

            ? FileCache.putDtoAndImage( ARTICLE_URL, serialized, image )
            : FileCache.putDto( ARTICLE_URL, dto )

        ); 
    }

    /**
     * Closes the editor, if response is set,
     * Send it as a detail with 'recipe-edit-ok'-event
     * @param {boolean} response 
     */
    closeEditor( response = undefined )
    {
        if ( response ) this.emit( 'article-edit-ok', { response } );
        this.remove();
        delete this;
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        this.emit( 'article-editor-connected' );
        /**
         * Turn the parent view off for now
         */
        this.mViewNode.style.display = 'none';

    }

    disconnectedCallback()
    {
        /**
         * Turn the parent view on again
         */
        this.mViewNode.style.display = 'flex';
    }  

}

window.customElements.define( 'article-editor', ArticleEditor );

export { ArticleEditor };