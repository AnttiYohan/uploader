import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
import { FileCache } from '../util/FileCache.js';


/**
 * Mobile Application Emulated View:
 * Recipe Search Result List Activity
 */
class RecipeBrowseScreen extends WCBase
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
        <ul class='component'>
           <li class='component__row'>Recipe 1</li>
           <li class='component__row'>Recipe 2</li>
        </ul>`);

        this.setupStyle
        (`.component {
           width: 300px;
        }`);
        this.mList = this.shadowRoot.querySelector('.component');

    }


    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'recipe-browse-screen-connected' );
        this.shadowRoot.addEventListener('recipe-search-result', e => 
        {
            const result = e.detail.result;

        }, true);
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-browse-screen', RecipeBrowseScreen );

export { RecipeBrowseScreen };