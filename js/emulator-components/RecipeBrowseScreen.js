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
        </ul>`);

        this.setupStyle
        (`.component {
           background-color: #eef;
           border-radius: 2px;
           border: 1px solid rgba(0,0,0,.25);
           box-shadow: 0 0 8px -1px rgba(0,0,0,.25);
           width: 300px;
           display: flex;
           flex-direction: column;
        }
        .recipe__entry {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 48px;
            box-shadow: inset 0 -5px 20px -5px rgba(0,0,0,.25);
            border: 1px solid rgba(0,0,0,.15);
            font-weight: 200;
            color: #444;
            font-size: 15px;
            text-transform: uppercase;
        }
        .recipe_entry .thumbnail {
            justify-self: flex-start;
            width: 40px;
            height: 40px;
            margin: auto;
            border-radius: 2px;
        }
        `);
        this.mList = this.shadowRoot.querySelector('.component');

    }

    populateList( result )
    {
        if ( ! result ) return;

        let recipes = undefined;

        try {

            recipes = JSON.parse( result );

        }
        catch ( error ) { return error; }

        if ( recipes && recipes.length )
        {
            for ( const entry of recipes )
            {
                const { id, title, mediaDto } = entry;
                if ( ! id || ! title ) continue;

                if ( mediaDto && mediaDto.thumbnail )
                {
                    // create image
                }

                const recipeEntry = newTagClassAttrs
                ( 
                    'li', 
                    'recipe__entry', 
                    {
                        'data-title': title,
                        'data-id': id
                    }
                );
                recipeEntry.textContent = title;

                this.mList.appendChild( recipeEntry );
            }
        }
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

            this.populateList( result );
        }, true);
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-browse-screen', RecipeBrowseScreen );

export { RecipeBrowseScreen };