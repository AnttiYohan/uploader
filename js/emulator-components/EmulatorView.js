import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
import { FileCache } from '../util/FileCache.js';
import { TextInputRow } from '../TextInputRow.js';
import { ResponseNotifier } from '../ResponseNotifier.js';


/**
 * Mobile App Emulator View
 */
class EmulatorView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------
        this.mProductObjects = [];

        console.log(`ProductView::constructor called`);

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='uploader'>
            <div class='uploader__frame' data-input-frame>
                <button class='button--refresh'>Refresh</button>
            </div>
        </div>`);
        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        
        const refreshButton = this.shadowRoot.querySelector('.button--refresh');
        refreshButton.addEventListener
        ('click', e => 
        { 
            FileCache.clearCache( RECIPE_URL );
            this.loadRecipes();
        });

    }

    /**
     * Read recipes from cache or from server
     */
    loadRecipes()
    {
        FileCache.getRequest( RECIPE_URL)
        .then(response => 
        { 
            console.log(`GET /RECIPE_URL (emulator) status: ${response.status}`);

            if (response.ok)
            {
                console.log(`Recipes retrieved succesfully`);
                try { this.generateList( JSON.parse(response.text)); } 
                catch (error) { throw new Error(`Product parse failed: ${error}`); }
            }
            else throw new Error(`Server responded with: ${response.text}`);
            
        })
        .catch(error => { console.log(`Could not read products: ${error}`); });
    }

    generateList( recipes )
    {
        console.log( `Recipe amoutn: ${recipes.length}` );
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'emulator-view-connected' );
        this.loadRecipes();
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'emulator-view', EmulatorView );

export { EmulatorView };