import { WCBase } from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { InputOperator } from './util/InputOperator.js';
import { NumberInputRow } from './NumberInputRow.js'
import { ResponseNotifier } from './ResponseNotifier.js';
import { EditorBase } from './EditorBase.js';

/**
 * ViewBase is the base View for all BabyFoodWorld Main views.
 * Main views are the ones, which are preloaded, and directly
 * under the header menu tabs.
 */
class ViewBase extends WCBase
{
    constructor( key, route, options = {} )
    {
        super();
        
        this.mEntityKey      = key;
        this.ENTITY_URL      = route;
        this.mEditable       = 'editable' in options ? true : false;
        this.mResponseKey    = 'responseKey' in options ? options.responseKey : `${key}Dto`;
        this.mEntityTitleKey = 'titleKey' in options ? options.titleKey : 'title';
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        const capitalized = key.charAt(0).toUpperCase() + key.substring(1);
        /**
         * Build the editor component struct
         */

        this.attachShadow( { mode: 'open'} );
        this.setupTemplate(
        `<link rel='stylesheet' href='assets/css/components.css'>
        <div class='popup-connector'></div>   
        <div class='uploader view-node'>
            <div class='uploader__frame' data-input-frame>
                <button class='button--refresh'>Reload</button>
                ${'template' in options ? options.template : ''}
                <button class='button--save'>Save</button>
            </div>
            <!-- Existing products frame -->
            <div class='uploader__frame--scroll ${key}_list'>
                <entry-browser data-browser='${key}_browser' data-edit=true>${capitalized}s:</entry-browser>
            </div>
         </div>`);

        if ( 'style' in options ) this.setupStyle( options.style );

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mEditorNode  = this.shadowRoot.querySelector( '.popup-connector' );
        this.mRootElement = this.shadowRoot.querySelector( '.uploader' );
        this.mViewNode    = this.shadowRoot.querySelector( '.view-node' );
        this.mAddButton   = this.shadowRoot.querySelector( '.button--save' );
        this.mBrowser     = this.shadowRoot.querySelector( `[data-browser="${key}_browser"]` );
        
        const refreshButton = this.shadowRoot.querySelector('.button--refresh');
        refreshButton.addEventListener( 'click', e => 
        { 
            FileCache.clearCache( this.ENTITY_URL );
            this.loadEntities();
        });

        this.mInputFrame = this.shadowRoot.querySelector('.uploader__frame[data-input-frame]');
        const inputArray = Array.from( this.mInputFrame.querySelectorAll('[data-input]') );
        this.mInputOperator = new InputOperator( key, inputArray );
        console.log(`InputArray lenght: ${inputArray.length}`);

        // ------------------------------
        // - Setup button click listeners
        // ------------------------------
        this.mAddButton.addEventListener( 'click', e => this.addEntity() );

    }

    /**
     * Reads the input operator inputs and
     * generates a DTO of the values.
     * First param controls the dto serialization
     * Second param will be embedded into the dto,
     * if it has content
     * 
     * @param {boolean} serialize, serializes the request dto if set
     * @param {object}  emded, embeds the contents of this to the dto    
     */
    addEntity( serialize = true, embed = {} )
    {
        this.mClickedButton = this.mAddButton;
        // --------------------------------------
        // - Obtain input values and validate
        // - If dto and image file present, send
        // - To the server
        // --------------------------------------

        const dto = this.mInputOperator.processInputs( serialize, embed );
        console.log(`Product dto key ${dto.title}, data: ${dto.data}`);

        if ( ! dto ) return;

        const imageFile = this.mInputOperator.imageFile();
        
        if ( dto && imageFile )
        {
            const offsetTop    = Number(this.mAddButton.offsetTop - 200);
            const offsetLeft   = Number(this.mAddButton.offsetLeft);
            const bounds       = this.mAddButton.getBoundingClientRect();
            const buttonCenter = bounds.left + bounds.width / 2;
        
            const responseNotifier = new ResponseNotifier
            (
                this.mResponseKey,
                `Create ${capitalized}`, 
                `${capitalized} Created Succesfully`,
                `${capitalized} Could Not Be Created`,
                { top: `${offsetTop}px`, left: `${20}px`, center: buttonCenter }
            );
            this.mRootElement.appendChild( responseNotifier );
            responseNotifier.onSuccess( 
                () => {
                    this.loadEntities();
                    this.mInputOperator.reset();
                }
            );
            responseNotifier.onFail( (status, message) => console.log( `Status: ${status}: ${message}`) );
            responseNotifier.begin
            ( 
                FileCache.postDtoAndImage
                ( 
                    this.ENTITY_URL, 
                    dto, 
                    imageFile
                ) 
            );
        }
        else
        {
            console.log(`Add proper data and image file`);
        }
    }

    /**
     * Read entities from cache or from server
     * 
     * @param {array}  fields, a model, array of keys
     * @param {string} overwriteUrl, overwrite entity url with this
     */
    async loadEntities( fields = [], overwriteUrl = null )
    {
        const { ok, status, text } = await FileCache.getCached
        (  
            overwriteUrl ? overwriteUrl : this.ENTITY_URL
        );

        let entities;

        console.log(`GET /${this.mEntityKey} response status: ${status}`);

        if ( ok )
        {
            try
            {
                entities = JSON.parse( text );
            }
            catch (error) 
            {
                console.log( `ViewBase::loadEntities error ${error}` );
            }

            if ( entities && Array.isArray( entities ) )
            {
                this.generateList( entities, fields );
            }
        }
        else
        {
            if ( status == 403 )
            {
                this.emit( 'logout-signal' );
            }
        }

        return entities;
    }


    /**
     * Generates the an entity list
     * 
     * @param {array} list 
     */
    generateList( entities, fields = [] )
    {
        const model = {
            titlekey: this.mEntityTitleKey,
            fields
        };

        this.mBrowser.pushDataSet( entities, model );
    }

    /**
     * Executes HTTP DELETE by product route / id
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    removeEntity( id )
    {
        console.log(`Remove ${this.mEntityKey} with ${id} called`);
        const capitalized  = this.mEntityKey[0].toUpperCase() + this.mEntityKey.substring(1);
        const offsetTop    = Number(this.mBrowser.offsetTop);
        const offsetLeft   = Number(this.mBrowser.offsetLeft);
        
        const responseNotifier = new ResponseNotifier
        ( 
            this.mResponseKey,
            `Remove ${capitalized}`, 
            `${capitalized} Removed Succesfully`,
            `${capitalized} Could Not Be Removed`,
            { top: `${offsetTop}px`, left: `${offsetLeft}px` }
     
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( () => this.loadEntities() );
        responseNotifier.onFail( ( status, message ) => console.log( `Status: ${status}: ${message}`) );
        responseNotifier.begin( FileCache.delete( this.ENTITY_URL, id ) );
    }

    /**
     * Open the product editor by reading the ProductDTO from the server
     * 
     * @param  {number} id 
     */
    async openEditorById( id, relatedSet = [] )
    {
        if ( ! id ) return;

        const { status, ok, text } = await FileCache.getRequest( `${this.ENTITY_URL}/${id}`, true, false );

        if ( ok )
        {
            let entity = undefined;

            try 
            {
                entity = JSON.parse( text );
            }
            catch ( error )
            {
                console.log( `Could not parse ${this.mEntityKey}: ${error}` );
            }

            if ( entity )
            {
                /**
                 * Import the editor dynamically
                 */
                const className = this.mEntityKey[0].toUpperCase() + this.mEntityKey.substring(1) + 'Editor';
                const editorClass = ( await import( `./${className}.js` ) )[ className ];

                this.mEditorNode.appendChild
                ( 
                    relatedSet.length 
                    ? new editorClass( entity, this, this.mViewNode, relatedSet ) 
                    : new editorClass( entity, this, this.mViewNode )
                );
            }
        }
        else
        {
            console.log( `Could not read ${this.mEntityKey} from the server, status: ${status}`);
        }
    }


    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        /**
         * @listens remove-by-id
         * Initiates a HTTP DELETE /{entity}/{id} Request
         */
        // Turned off for now
        this.listen( 'remove-by-id', e => this.removeEntity( e.detail.entry.id ) );
    
        /**
         * @listens edit-by-id
         * Requests the entity by the id,
         * Opens the Editor with the DTO in response
         */
        this.listen( 'edit-by-id',   e => this.openEditorById( e.detail.entry.id ) );

        /**
         * @listens entity-edited
         * Realoads product on receipt
         */
        this.listen( `${this.mEntityKey}-edited`, e => this.loadEntities() );

        this.loadEntities();
    }
}

export { ViewBase };