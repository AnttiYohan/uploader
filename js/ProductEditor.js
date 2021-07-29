import 
{
    WCBase,
    PRODUCT_URL

} from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EditorLabel } from './EditorLabel.js';
import { EditorImage } from './EditorImage.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';


/**
 * This is an Editor Popup for ProductView  
 */
class ProductEditor extends WCBase
{
    /**
     * ProductEditor Constructor function 
     * ------
     * @param {Object}      dto, holds the data of selected article
     * @param {Context}     parent, article view 
     * @param {HTMLElement} viewNode, the article view root node 
     */
    constructor( dto, parent, viewNode )
    {
        const model = [
            {
                'prop': 'mediaDto',
                'type': 'image',
                'title': 'Image'
            },
            {
                'prop': 'productCategory',
                'type': 'select',
                'title': 'Category'
            }
        ];

        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mEntityId          = dto.id;
        this.mEntityDto         = dto;
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
                <editor-label data-label='name'>Current Name</editor-label> 
                <text-input-row data-input='name'>New Name</text-input-row>
            </div>
            <div class='editor__component'>
                <editor-image data-label='mediaDto'>Current Image</editor-image>
                <image-input-row data-input='mediaDto'>New Image</image-input-row>
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
        this.mInputOperator  = new InputOperator( 'product', Array.from(dataInputFrame.querySelectorAll('[data-input]')));
        this.mInputOperator.setComponentFrame( dataInputFrame );
        this.mInputOperator.loadComponents
        (
            Array.from( dataInputFrame.querySelectorAll( '.editor__component' ) ),
            dto,
            []
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
            const name  = this.mInputOperator.getEditorEntry( 'name' );
            
            const data = { id: this.mEntityId }
            if ( name )
            {
                data[ 'name' ] = name; 
            }

            if ( ! data && ! image ) return;

            this.updateEntity( { 'title': 'product', 'data': JSON.stringify( data ) }, image );
                    
        });

    
    }

    /**
     * Updae methods for 1:1 fields
     * @param   {object} dto
     * @param   {File}   image
     * @return 
     */
    async updateEntity( dto, image )
    {
        const offsetTop  = Number(this.mClickedButton.offsetTop - 200);
        const offsetLeft = Number(this.mClickedButton.offsetLeft);
        const responseNotifier = new ResponseNotifier
        (
            'productDto',
            'Update Product', 
            'Product Updated Succesfully',
            'The Product Could Not Be Updated',
            { top: `${offsetTop}px`, left: `${20}px` }
        );
        //this.mViewNode.appendChild( responseNotifier );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( entity => this.mInputOperator.reloadEditor( entity ) );
        responseNotifier.onFail(( status, message ) =>
            console.log( `ProductEditor::update article fail: status ${status}, ${message}`)
        );
        responseNotifier.begin( FileCache.putDtoAndImage( PRODUCT_URL, dto, image ) ); 
    }

    /**
     * Closes the editor, if response is set,
     * Send it as a detail with 'recipe-edit-ok'-event
     * @param {boolean} response 
     */
    closeEditor( response = undefined )
    {
        if ( response ) this.emit( 'product-edit-ok', { response } );
        this.remove();
        delete this;
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        this.emit( 'product-editor-connected' );
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

window.customElements.define( 'product-editor', ProductEditor );

export { ProductEditor };