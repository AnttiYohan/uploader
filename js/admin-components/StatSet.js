import { WCBase } from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { newTagClassChildren } from '../util/elemfactory.js';

/**
 * StatSet is a list/set of statistical items
 * articles/product/recipe/files/thumbnails/users
 */
class StatSet extends WCBase
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
        (
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='component'>
            <div class='component__row'>
                <h4 class='component__header'><slot></h4>
            </div>
            <ul class='stat'>
            </ul>
         </div>`
        );    
        
        this.setupStyle
        (`.stat { margin: 8px auto; padding: 8px; display: flex; flex-direction: column; width: 100%; box-shadow -2px 2px 13px -3px rgba(0,0,0,.25); background-color: #f0f2ff; border-radius: 6px; border: 1px solid rgba(0,0,20,.25); }
          .stat__entry { display: flex; height: 64px; border-bottom: 1px solid rgba(0,0,0,.12); }
          .stat__key   { min-width: 120px display: flex; }
          .stat__value { width: 100%; margin-left: .7em; display: flex; }
        `);
        // ---------------------------
        // - Save element references
        // ---------------------------

        const refreshButton = this.shadowRoot.querySelector('.button--refresh');

        this.mStat = this.shadowRoot.querySelector( '.stat' );
        /*refreshButton.addEventListener('click', e => 
        { 
            FileCache.clearCache(ARTICLE_URL);
            this.loadArticles();
        });*/

        
    }

    pushDataSet( set )
    {
        if ( ! set || ! Array.isArray( set ) ) return;

        for ( const entry of set )
        {
            const elem = newTagClassChildren
            (
                'li',
                'stat__entry',
                [
                    newTagClassHTML( 'h4', 'stat__key',   entry.key   ),
                    newTagClassHTML( 'p',  'stat__value', entry.value )
                ]
            )
        }
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

window.customElements.define( 'stat-set', StatSet );

export { StatSet };