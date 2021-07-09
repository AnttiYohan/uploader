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
        <ul class='component'>
            <li class='component__row identity'>
                <img class='recipe__img'>
                <h4 class='recipe__title'>
            </li>
            <li class='component__column'>
                <div class='component__row'>
                    <p class='component__label'>Preparation time</p>     
                </div>
                <div class='component__row preparation_time'>
                </div>
            </li>
            <li class='component__column'>
                <div class='component__row'>
                    <p class='component__label'>Instructions</p>     
                </div>
                <div class='component__row instructions'>
                </div>
            </li>
            <li class='expandable steps'>
                <div class='component__row'>
                    <p class='component__label'>Steps</p>
                    <div class='expandable__toggle'></div>
                </div>
                <ul class='expandable__content'>
                </ul>
            </li>
            <li class='expandable ingredients'>
                <div class='component__row'>
                    <p class='component__label'>Ingredients</p>
                    <div class='expandable__toggle'></div>
                </div>
                <ul class='expandable__content'>
                </ul>
            </li>
        </ul>`);

        this.setupStyle
        (`
        .expandable { display: flex; flex-direction: column; margin-bottom: 8px; padding: 0 4px; }
        .expandable .expandable__toggle { cursor: pointer; margin: auto; width: 20px; height: 20px; justify-self: flex-end; background-size: cover; background-repeat: no-repeat; background-image: url( './assets/icon_plus.svg'); }
        .expandable .expandable__toggle.open { background-image: url( './assets/icon_cached.svg' ); }
        .expandable .expandable__content { display: none; margin-top: 8px; }
        .expandable .expandable__content.open { display: flex; flex-direction: column; }
        .expandable .expandable__entry {
            display: flex;
            align-items: center;
            height: 32px;
            box-shadow: inset 0 -5px 20px -5px rgba(0,0,0,.25);
            border-bottom: 1px solid rgba(0,0,0,.15);
            font-weight: 200;
            color: #444;
            text-transform: uppercase;
        }
        .expandable .expandable__entry:last-of-type { border-bottom: none; }
        .component {
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
        .component__row { margin-bottom: 8px; }
        .component__row:last-of-type { margin-bottom: 0; }
        .identity { position: relative; width: 100%; height: auto; }
        .recipe__img { width: 100%; max-height: 300px; object-fit: cover; }
        .recipe__title { position: absolute; width: 100%; top: 8px; left: 0; right: 0; height: 64px; display: flex; justify-content: center; font-size: 21px; color: #fff; }
        `);

        this.mTitle             = this.shadowRoot.querySelector('.recipe__title');
        this.mImage             = this.shadowRoot.querySelector('.recipe__img');
        this.mPrepararationTime = this.shadowRoot.querySelector('.preparation_time');
        this.mInstructions      = this.shadowRoot.querySelector('.instructions');

        // ---------------------------
        // - Save element references
        // ---------------------------


    }

    /**
     * Add event listeners into the expandable controls
     */
    initExpandables()
    {
        this.mSteps       = this.shadowRoot.querySelector('.steps .expandable__content');
        this.mIngredients = this.shadowRoot.querySelector('.ingredients .expandable__content');

        const expandables = Array.from( this.shadowRoot.querySelectorAll( '.expandable' ) );

        for ( const e of expandables )
        {
            const content = e.querySelector( '.expandable__content' );
            const toggle  = e.querySelector( '.expandable__toggle' );

            if ( toggle && content )
            {
                toggle.addEventListener( 'click', e => 
                {
                    toggle.classList.toggle( 'open' );
                    content.classList.toggle( 'open' );
                });
            }
        }

    }
    /**
     * Constructs a recipe instruction details
     * from a text blob
     * ------
     * @param  {string} data 
     */
    populateScreen( data )
    {
        if ( ! data || typeof data !== 'string' ) return;

        let recipe = undefined;

        try {

            recipe = JSON.parse( data );

        }
        catch ( error ) { return; }

        deleteChildren( this.mSteps );
        deleteChildren( this.mIngredients );

        /**
         * The recipe should be parsed into a JSON object,
         * let's populate the details
         */
        this.mTitle.textContent = recipe.title;

        if ( recipe.mediaDto.image )
        {
            this.mImage.src = `data:${recipe.mediaDto.image.type};base64,${recipe.mediaDto.image.data}`;
        }
        else
        if ( recipe.mediaDto.thumbnail )
        {
            this.mImage.src = `data:${recipe.mediaDto.thumbnail.type};base64,${recipe.mediaDto.thumbnail.data}`;
        }
    
        this.mPrepararationTime.textContent = `${recipe.prepareTimeInMinutes} minutes`;
        this.mInstructions.textContent = recipe.instructions;

        if ( recipe.products && recipe.products.length )
        {
            for ( const product of recipe.products )
            {
                this.mIngredients.appendChild
                (
                    newTagClassHTML
                    (
                        'li', 
                        'expandable__entry', 
                        product.name
                    )
                );
            }
        }

    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.initExpandables();
        this.emit( 'recipe-detail-screen-connected' );
        window.addEventListener( 'recipe-detail-result', e => 
        {
            this.populateScreen( e.detail );
        }, true);
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-detail-screen', RecipeDetailScreen );

export { RecipeDetailScreen };