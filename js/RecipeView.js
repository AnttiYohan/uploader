import { RECIPE_URL, RECIPE_ALL_URL, RECIPE_WITH_STEPS } from './WCBase.js';
import { ViewBase } from './ViewBase.js';
import { FileCache } from './util/FileCache.js';
import { StepStore } from './step-components/StepStore.js';
import { EventBouncer } from './EventBouncer.js';
import { ProductStore } from './product-components/ProductStore.js';
import { TextInputArea } from './TextInputArea.js';
import { MultiEntryRow } from './MultiEntryRow.js';
import { IngredientMenu } from './IngredientMenu.js';
import { BinaryButtonRow } from './BinaryButtonRow.js';
import { BinarySwitchGroup } from './BinarySwitchGroup.js';

/**
 * RecipeView is one of the top level views in the BabyFoodWorld admin app.
 * The top level views are all loaded parallerly,
 * the visible view is selected by the header tabs
 * ---
 * The other top level view are:
 * - AdminView
 * - ArticleView
 * - ProductView
 * - EmulatorView
 */
class RecipeView extends ViewBase
{
    constructor()
    {
        const template =
        `<text-input-row   class='title_input'     data-input='title' required>Title</text-input-row>
        <image-input-row  class='image_input'     data-input='image' required>Recipe Image</image-input-row>
        <text-input-row   class='link_input'      data-input='originalRecipeLink' required>Recipe Link</text-input-row> 
        <text-input-row   class='youtube_input'   data-input='youtubeVideoLink'>Video Link</text-input-row>
        <number-input-row class='age_input'       data-input='monthsOld' unit='Months' required>Age</number-input-row>
        <number-input-row class='prep_time_input' data-input='prepareTimeInMinutes' unit='Min' required>Preparation time</number-input-row>
        <number-input-row class='cook_time_input' data-input='cookTimeInMinutes' unit='Min' required>Cook time</number-input-row>
        <event-bouncer data-emitters='["product-select"]'>
            <ingredient-menu data-connect='host' class='product_menu'
                             data-emit='product-select'
            >Product menu:</ingredient-menu>
            <product-store data-input='products' data-connect='slave'>Ingredients</product-store>
        </event-bouncer>
        <text-input-area class='instructions_input' data-input='instructions' required>Instructions</text-input-area>
        <text-input-area class='storage_input' data-input='storageInfo' required>Storage</text-input-area>
        <binary-switch-group class='season_input' data-input='season' data-null group='[
            { "title": "Winter", "value": "WINTER" }, 
            { "title": "Spring", "value": "SPRING" },
            { "title": "Summer", "value": "SUMMER" },
            { "title": "Autumn", "value": "AUTUMN" },
            { "title": "All", "value": "ALL", "fill": true }
        ]'>Season</binary-switch-group>
        <binary-button-row class='fingerfood_input'  data-input='fingerFood'>Fingerfood</binary-button-row>
        <binary-button-row class='has_to_cook_input' data-input='hasToCook'>Has To Cook</binary-button-row>
        <binary-button-row class='allergens_input'   data-input='allergens' blocked>Allergens</binary-button-row>
        <binary-button-row class='eggs_input' blocked>Has Eggs</binary-button-row>
        <binary-button-row class='nuts_input' blocked>Has Nuts</binary-button-row>
        <binary-button-row class='lactose_input' blocked>Has Lactose</binary-button-row>
        <binary-button-row class='gluten_input' blocked>Has Gluten</binary-button-row>       
        <binary-switch-group data-input='mealTypes' class='meal_types_input' group='[
            { "title": "Breakfast", "value": "BREAKFAST" },
            { "title": "Lunch", "value": "LUNCH" }, 
            { "title": "Dinner", "value": "DINNER" },
            { "title": "Snack", "value": "SNACK" },
            { "title": "Dessert", "value": "DESSERT" },
            { "title": "Appetizer", "value": "APPETIZER" },
            { "title": "Salad", "value": "SALAD" },
            { "title": "Soup", "value": "SOUP" },
            { "title": "Smoothie", "value": "SMOOTHIE" },
            { "title": "Beverages", "value": "BEVERAGES" }
        ]'>Meal Types</binary-switch-group>
        <step-store       data-input='steps'>Steps</step-store>
        <multi-entry-row  data-input='tips'>Tips</multi-entry-row>
        <number-input-row data-input='nutritionValue'>Nutrition kcal</number-input-row>
        <text-input-row   data-input='interestingInfo'>Interesting Info</text-input-row>`;
    
        /**
         * Pass to the base:
         * - entity name
         * - route
         * - options { editable, responseKey, titleKey, template }
         */
         super
         (
            'recipe',
            RECIPE_URL,
            { 
                editable: true, 
                responseKey: 'recipeDto', 
                titleKey: 'title',
                template
            }
         );
     
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------
        this.mAvailableProducts = [];

        // --------------------------------------------
        // - Save element references
        // - These must be handled here in the concrete 
        // - View Class
        // --------------------------------------------

        this.mProductMenu       = this.shadowRoot.querySelector( '.product_menu' );
        this.mAllergensInput    = this.shadowRoot.querySelector( '.allergens_input' );
        this.mEggsInput         = this.shadowRoot.querySelector( '.eggs_input' );
        this.mNutsInput         = this.shadowRoot.querySelector( '.nuts_input' );
        this.mLactoseInput      = this.shadowRoot.querySelector( '.lactose_input' );
        this.mGlutenInput       = this.shadowRoot.querySelector( '.gluten_input' );
   
        /**
         * @listens allergens-map
         */
        this.shadowRoot.addEventListener( 'allergens-map', e =>
        {
            const allergens = e.detail.allergens;

            if ( allergens )
            {
                let hasAllergens = allergens.hasAllergens;
                const { 

                    hasEggs,
                    hasNuts,
                    hasGluten,
                    hasLactose

                } = allergens;

                console.log(`RecipeView event: allergens-added hasAllergens: ${hasAllergens}`);

                // --------------------------------------
                // - Apply properties only when set
                // --------------------------------------

                if ( hasEggs || hasNuts || hasGluten || hasLactose ) hasAllergens = true;

                if ( hasAllergens ) this.mAllergensInput.turnOn();
                if ( hasEggs )      this.mEggsInput.turnOn();
                if ( hasNuts )      this.mNutsInput.turnOn();
                if ( hasGluten )    this.mGlutenInput.turnOn();
                if ( hasLactose )   this.mLactoseInput.turnOn();
            }
        }, true );

        /**
         * Listen to the 'product-list' broadcast from ProductView,
         * Add the broadcast details into the IngredientMenu
         * 
         * @listens product-list
         */
        window.addEventListener( 'product-list', e => 
        {
            const list = e.detail;
            if ( list && Array.isArray(list) )
            {
                this.mAvailableProducts = list;
                try  { this.mProductMenu.pushDataSet(list); }
                catch (error) { console.log( `RecipeView ProductMenu init error: ${error}` ); }
            }
        });
    }

    /**
     * Overrides the ViewBase addEntity in order
     * to handle the request with steps
     */
    addEntity()
    {
        // --------------------------------------
        // - Obtain input values and validate
        // - If dto and image file present, send
        // - To the server
        // --------------------------------------
        /*const embed = hasSteps 
                    ? { 'hasSteps': false }
                    : { 'hasSteps': true };*/
    
        const hasSteps  = this.mInputOperator.getValue( 'steps' );

        /**
         * If there are not steps,
         * return by executing the parent function with 
         * embedded { hasSteps: false }
         */
        if ( ! hasSteps )
        {
            return super.addEntity( true, { hasSteps: false } );
        }

        /**
         * Parse an unserialized DTO for the step request
         */
        const dto   = this.mInputOperator.processInputs( false, { hasSteps: true } );
        const image = this.mInputOperator.imageFile();

        if ( dto && image && dto.data.steps )
        {            
            /**
             * Compile steps and unages into separate objects
             */
            const stepDto    = { title: 'steps',      data: [] };
            const stepImages = { title: 'stepImages', images: [] };
            for ( const step of dto.data.steps )
            {
                console.log(`Step ${step}`);
                stepDto.data.push( { text: step.text, stepNumber: step.stepNumber } );
                stepImages.images.push( step.image );
            }

            // --------------------------------------
            // - Remove the steps data from the
            // - recipe dto and serialize it,
            // - Create also a serialized DTO for the
            // - Steps
            // --------------------------------------
            dto.data.steps = null;
            const finalDto = 
            { 
                title: dto.title, 
                data: JSON.stringify( dto.data ) 
            };
            const finalStepDto =
            {
                title: stepDto.title,
                data: JSON.stringify( stepDto.data )
            };

            let pullLeft = window.innerWidth > 600 ? 300 : window.innerWidth / 2;

            const offsetTop    = Number(this.mAddButton.offsetTop - 200);
            let   offsetLeft   = Number(this.mAddButton.offsetLeft - pullLeft);
            const bounds       = this.mAddButton.getBoundingClientRect();
            const buttonCenter = bounds.left + bounds.width / 2;
        
            if ( offsetLeft < 20 ) offsetLeft = 20;

            const responseNotifier = new ResponseNotifier
            (
                'recipeDto',
                'Create Recipe', 
                'Recipe Created Succesfully',
                'Recipe Could Not Be Created',
                { top: `${offsetTop}px`, left: `${20}px`, center: buttonCenter } 
            );
            this.mRootElement.appendChild( responseNotifier );
            responseNotifier.onSuccess( 
                () => {
                    this.loadEntities();
                    this.mInputOperator.reset();
                }
            );
            responseNotifier.onFail( ( status, message ) => console.log( `status: ${status}: ${message}` ) );
            responseNotifier.begin( 
                FileCache.postDtoAndImageWithChildren
                (
                    RECIPE_WITH_STEPS,
                    finalDto,
                    image,
                    finalStepDto,
                    stepImages
                )
            );
        }    
        else
        {
            console.log(`Add proper data and image file`);
        }        
    }

    
    /**
     * Opens the recipe editor with available products
     * @param  {number} id 
     */
    async openEditorById( id )
    {
        super.openEditorById( id, this.mAvailableProducts );
    }
  
    
   /**
    * Read recipes from cache or from server
    * --------------------------------------
    */
    async loadEntities()
    {
        super.loadEntities( [], RECIPE_ALL_URL );
    }
    
    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'recipe-view', RecipeView );

export { RecipeView };