import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
import { FileCache } from '../util/FileCache.js';
import { TextInputRow } from '../TextInputRow.js';
import { NumberInputRow } from '../NumberInputRow.js';
import { ProductSelector } from './ProductSelector.js';


/**
 * Mobile Application Emulated View:
 * Recipe Search Form Activity
 */
class RecipeSearchScreen extends WCBase
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
            <number-input-row data-input='monthsOld'>Baby Age in Months</number-input-row>
            <product-selector data-input='products'></product-selector>
            <button class='button--save'>Search</button>
        </div>`);


        this.setupStyle
        (`.component {
           width: 300px;
        }`);
        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mProductSelector = this.shadowRoot.querySelector('[data-input="products"]');
        const searchButton    = this.shadowRoot.querySelector('.button--save');
        searchButton.addEventListener( 'click', e =>
        {
            this.commitSearch();
        });
    }

    commitSearch()
    {
        //1. read inputs
        //2. query recipes
        //3. emit 'recipe-search-result' custom event with recipe list as detail
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'recipe-search-screen-connected' );
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-search-screen', RecipeSearchScreen );

export { RecipeSearchScreen };