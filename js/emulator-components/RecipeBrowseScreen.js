import { RECIPE_URL, RECIPE_STEP_THUMBNAILS_URL, WCBase } from '../WCBase.js';
import { deleteChildren, newTagClass, newTagClassAttrsChildren, newTagClassChildren, newTagClassHTML } from '../util/elemfactory.js';
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

        this.mEntryList = [];

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
           height: 480px;
           background-color: #eef;
           border-radius: 2px;
           border: 1px solid rgba(0,0,0,.25);
           box-shadow: 0 0 8px -1px rgba(0,0,0,.25);
           width: 300px;
           display: flex;
           flex-direction: column;
           overflow-y: scroll;
        }
        .component__column { margin: auto; }
        .alert--no-matches {
            width: 100%;
            height: 100%;
            display: flex;
            font-size: 18px;
            text-transform: uppercase;
            text-align: center;
        }
        .recipe__entry {
            cursor: pointer;
            margin-bottom: 8px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 64px;
            box-shadow: inset 0 -5px 20px -5px rgba(0,0,0,.25);
            border: 1px solid rgba(0,0,0,.15);
            font-weight: 200;
            color: #444;
            font-size: 15px;
            text-transform: uppercase;
        }
        .recipe__entry:last-of-type {
            margin-bottom: 0;
        }
        .recipe__entry .recipe__img {
            width: 64px;
            height: 64px;
            border-radius: 2px;
            object-fit: cover;
        }
        .recipe__entry .recipe__title {
            width: 100%;
            display: flex;
            text-align: center;
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

        /**
         * Wipe out the former results
         */
        deleteChildren( this.mList );
        this.mEntryList = [];

        /**
         * Check if there are matches
         */
        if ( recipes.length )
        {
            /**
             * Iterate through recipes
             * and display them on the screen 
             */
            for ( const entry of recipes )
            {
                const { id, title, mediaDto } = entry;
                if ( ! id || ! title ) continue;

                const thumbnailElement = newTagClass( 'img', 'recipe__img' );
                const recipeTitle = newTagClassHTML( 'h4', 'recipe__title', title );

                if ( mediaDto.thumbnail )
                {
                    thumbnailElement.src = `data:${mediaDto.thumbnail.type};base64,${mediaDto.thumbnail.data}`;
                }

                const recipeEntry = newTagClassAttrsChildren
                ( 
                    'li', 
                    'recipe__entry', 
                    {
                        'data-title': title,
                        'data-id': id
                    },
                    [
                        thumbnailElement,
                        newTagClassChildren
                        (
                            'div',
                            'component__column',
                            [
                                recipeTitle
                            ]
                        )
                    ]
                );

                /**
                 * Create click listener with action to open
                 * the recipe when clicked
                 */
                recipeEntry.addEventListener( 'click', e => 
                {
                    this.commitDetail( recipeEntry.dataset.id );
                });

                this.mEntryList.push( recipeEntry );
                this.mList.appendChild( recipeEntry );
            }
        }
        else
        {
            /**
             * No matches, display this on the screen
             */
            this.mList.appendChild
            (
                newTagClassHTML
                (
                    'li',
                    'alert--no-matches',
                    'No Recipes Found with Search Criteria!'
                )
            );
        }
    }

    /**
     * Send a recipe detail query and broadcast the response
     * ------
     * @param {string} id  
     */
    async commitDetail( id )
    {
        if ( ! id || typeof id !== 'string' ) return;

        /**
         * Query for recipes
         */
        const { ok, status, text } = await FileCache.getRequest
        ( 
            `${RECIPE_STEP_THUMBNAILS_URL}/${id}`, 
            true, 
            false 
        );

        /**
         * Broadcast the response
         */
        if ( ok )
        {
            console.log(`RecipeBrowseScreen::commitDetail -- response: ${status}`);
            this.emit( 'recipe-detail-result', text );
        }
    }

    updateEntryListHeight( height )
    {
        for ( const entry of this.mEntryList )
        {
            const img = entry.firstChild;
            if ( img ) 
            {
                img.style.width  = height;
                img.style.height = height;
            }
            entry.style.height = height;
        }
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'recipe-browse-screen-connected' );
        window.addEventListener( 'recipe-search-result', e =>
        //this.shadowRoot.addEventListener('recipe-search-result', e => 
        {
            this.populateList( e.detail );
        }, true);

        /**
         * Listen to emulator layout control changes
         */
        window.addEventListener( 'recipe-row-height', e =>
        //this.shadowRoot.addEventListener('recipe-row-height', e => 
        {
            console.log( `Recipe row height: ${e.detail}`);
            this.updateEntryListHeight( e.detail );
        }, true);
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-browse-screen', RecipeBrowseScreen );

export { RecipeBrowseScreen };