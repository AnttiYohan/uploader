import 
{
    WCBase

} from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EditorLabel } from './EditorLabel.js';
import { EditorImage } from './EditorImage.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';


/**
 * This is a Base Editor component that must be extended for concrete use 
 */
class EditorBase extends WCBase
{
    /**
     * EditorBase Constructor function 
     * ------
     * @param {String}      key, the entity title
     * @param {Object}      dto, holds the data of selected article
     * @param {Context}     parent, article view 
     * @param {HTMLElement} viewNode, the article view root node 
     * @param {String}      route, the update endpoint
     * @param {Object}      options, additional options
     */
    constructor( key, dto, parent, viewNode, route, options = {} )
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------
        
        this.mEntityKey         = key;
        this.mEntityId          = dto.id;
        this.mEntityDto         = dto;
        this.mParentContext     = parent;
        this.mViewNode          = viewNode;
        this.ENTITY_URL         = route;
        this.mRelatedSet        = options.hasOwnProperty( 'relatedSet' ) 
                                ? options.relatedSet 
                                : [];

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        /**
         * Build the editor component struct
         */

        this.attachShadow( { mode: 'open'} );
        this.setupTemplate(
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='notifier'></div>
         <div class='editor' data-input-frame>
            ${'template' in options ? options.template : ''}
            <button class='button exit'>Exit</button>
        </div>`);

        this.setupStyle
        (`
        .button { margin: 32px auto; display: block; }
        .update--one-to-one { margin-top: 32px; margin-bottom: 42px; display: block; }
        .notifier { position: absolute; }
        .dialog { top: 1000px; z-index:1; }
        .editor { max-width: 1200px; margin: 24px auto; padding: 0; box-shadow: 0 0 4px -1px rgba(0,0,0,.25); border-radius: 24px; border: 6px solid #abd; }
        ${'style' in options ? options.style : ''}
        `);

        this.mRootElement    = this.shadowRoot.querySelector( '.notifier' );
        const dataInputFrame = this.shadowRoot.querySelector( '[data-input-frame]' );
        this.mInputOperator  = new InputOperator( key, Array.from(dataInputFrame.querySelectorAll('[data-input]')));
        this.mInputOperator.setComponentFrame( dataInputFrame );
        this.mInputOperator.loadComponents
        (
            Array.from( dataInputFrame.querySelectorAll( '.editor__component' ) ),
            dto,
            this.mRelatedSet
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
            const data =  this.mInputOperator.getEditorDto();
            
            if ( ! data && ! image ) return;

            this.updateArticle( { 'title': key, 'data': JSON.stringify( data ) }, image );
                    
        });
    }

    /**
     * Updae methods for entity 1:1 fields
     * @param   {object} dto 
     * @return 
     */
    async updateEntity( dto, image )
    {
        const capitalized  = `${this.mEntityKey.charAt(0).toUpperCase()}${this.mEntityKey.substring(1)}`;
        const offsetTop    = Number(this.mClickedButton.offsetTop - 200);
        const offsetLeft   = Number(this.mClickedButton.offsetLeft);
        const bounds       = this.mClickedButton.getBoundingClientRect();
        const buttonCenter = bounds.left + bounds.width / 2;
        const responseNotifier = new ResponseNotifier
        (
            `${this.mEntityKey}Dto`,
            `Update ${capitalized}`, 
            `${capitalized} Updated Succesfully`,
            `The ${capitalized} Could Not Be Updated`,
            { top: `${offsetTop}px`, left: `${20}px`, center: buttonCenter }
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( entity => this.reloadEditor( entity ) );
        responseNotifier.onFail(( status, message ) =>
            console.log( `ArticleEditor::update ${this.mEntityKey} fail: status ${status}, ${message}`)
        );
        responseNotifier.begin( FileCache.putDtoAndImage( this.ENTITY_URL, dto, image ) ); 
    }

    /**
     * Reloads the editor with updated entity,
     * broadcasts entity-edited event
     * @emits entity-edited
     * @param {dto} entity
     */
    reloadEditor( entity )
    {
        this.mInputOperator.reloadEditor( entity );
        this.emit( `${this.mEntityKey}-edited` );
    }

    /**
     * Closes the editor 
     */
    closeEditor()
    {
        this.remove();
        delete this;
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    /**
     * Turn the parent view off for now
     */
    connectedCallback()
    {
        this.emit( `${this.mEntityKey}-editor-connected` );
        this.mViewNode.style.display = 'none';
    }

    /**
     * Turn the parent view on
     */
    disconnectedCallback()
    {
        this.mViewNode.style.display = 'flex';
    }  
}

export { EditorBase };