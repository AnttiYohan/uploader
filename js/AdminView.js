import { WCBase } from './WCBase.js';
import { StatSet } from './admin-components/StatSet.js';
import { FileCache } from './util/FileCache.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';

/**
 * AdminView is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Displays various meaningful BFW server stats
 * Manages crucial features
 */
class AdminView extends WCBase
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
         <div class='admin'>
           <stat-set data-entities='products'
                     data-entity='product' 
                     data-route='product/claims'
                     data-related='claims'
                     data-model='[
                         { "key": "product", "type": "single" },
                         { "key": "claims",  "type": "array" }
                     ]'
                     data-relation-phrase='is claimed by'       
            >Products used by Recipes</stat-set>
         </div>
         `);    
        
        this.setupStyle
        (`.admin { margin: 0 auto; display: flex; flex-direction: column; min-width: 300px; width: 85vw; max-width: 1200px;}
        `);
        // ---------------------------
        // - Save element references
        // ---------------------------

        const refreshButton = this.shadowRoot.querySelector('.button--refresh');

        /*refreshButton.addEventListener('click', e => 
        { 
            FileCache.clearCache(ARTICLE_URL);
            this.loadArticles();
        });*/

        
    }

    

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'admin-view', AdminView );

export { AdminView };