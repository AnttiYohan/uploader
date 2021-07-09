import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
import { FileCache } from '../util/FileCache.js';
import { TextInputRow } from '../TextInputRow.js';
import { NumberInputRow } from '../NumberInputRow.js';
import { ProductSelector } from './ProductSelector.js';


/**
 * Mobile Application Emulated View:
 * Recipe Details Activity
 */
class RecipeDetailScreen extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='component'>
        </div>`);
        // ---------------------------
        // - Save element references
        // ---------------------------

    }


    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'recipe-detail-screen-connected' );
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-detail-screen', RecipeDetailScreen );

export { RecipeDetailScreen };