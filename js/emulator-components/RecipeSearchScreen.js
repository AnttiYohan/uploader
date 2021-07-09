import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassAttrs, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
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

        this.mAgeInput        = this.shadowRoot.querySelector('[data-input="monthsOld"]');
        this.mProductSelector = this.shadowRoot.querySelector('[data-input="products"]');
        const searchButton    = this.shadowRoot.querySelector('.button--save');
        searchButton.addEventListener( 'click', e =>
        {
            this.commitSearch();
        });
    }

    async commitSearch()
    {
        let queryParams = '';

        /**
         * Read the age input
         */
        const age = this.mAgeInput.value;
        if  ( age ) queryParams = `?monthsOld=${age}`;

        /**
         * Read the product selection input
         */
        const products = this.mProductSelector.value;
        if  ( products ) for ( const product of products )
        {
            queryParams += queryParams.length ? '&' : '?';
            queryParams += `products=${product}`;
        }

        console.log( `RecipeSearchScreen::commitSearch query: ${RECIPE_URL}${queryParams}`);

        /**
         * Query for recipes
         */
        const { ok, status, text } = await FileCache.getRequest( RECIPE_URL + queryParams );

        /**
         * Broadcast the response
         */
        if ( ok )
        {
            console.log(`RecipeSearchScreen::commitSearch -- response: ${text}`);
            this.emit( 'recipe-search-result', text );
        }
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