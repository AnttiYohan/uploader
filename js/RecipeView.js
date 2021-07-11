import { WCBase, RECIPE_URL } from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { StepEditor } from './StepEditor.js';
import { ProductRow } from './ProductRow.js';
import { RecipeEditor } from './RecipeEditor.js';
import { EventBouncer } from './EventBouncer.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { TextInputArea } from './TextInputArea.js';
import { InputOperator } from './util/InputOperator.js';
import { ImageInputRow } from './ImageInputRow.js';
import { MultiEntryRow } from './MultiEntryRow.js';
import { NumberInputRow } from './NumberInputRow.js'
import { IngredientMenu } from './IngredientMenu.js';
import { BinaryButtonRow } from './BinaryButtonRow.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { BinarySwitchGroup } from './BinarySwitchGroup.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <!--div-->
  <!-- The editor is connected here when utilized -->
<div class='popup__connector'></div>
  
<!-- Wrapper for the whole recipe view, display set to none while in editor -->
<div class='uploader view_node'>

  <div class='uploader__frame' data-input-frame>

    <button class='button--refresh'>Refresh</button>
    <text-input-row   class='title_input'     data-input='title' required>Title</text-input-row>
    <image-input-row  class='image_input'     data-input='image' required>Recipe Image</image-input-row>
    <text-input-row   class='link_input'      data-input='originalRecipeLink' required>Recipe Link</text-input-row> 
    <text-input-row   class='youtube_input'   data-input='youtubeVideoLink'>Video Link</text-input-row>
    <number-input-row class='age_input'       data-input='monthsOld' unit='Months' required>Age</number-input-row>
    <number-input-row class='prep_time_input' data-input='prepareTimeInMinutes' unit='Min' required>Preparation time</number-input-row>
    <number-input-row class='cook_time_input' data-input='cookTimeInMinutes' unit='Min' required>Cook time</number-input-row>

    <!-- Product add input -->
    <event-bouncer data-emitters='["product-select"]'>
        <ingredient-menu data-connect='host' class='product_menu'
                         data-emit='product-select'
        >Product menu:</ingredient-menu>
        <product-row data-connect='slave' data-input='products' data-collect='product-select'></product-row>
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

    <!-- RECIPE MEALTYPES MULTISELECTION -->

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
    <step-editor class='step_editor' data-input='stepBySteps'></step-editor>

    <multi-entry-row  data-input='tips'>Tips</multi-entry-row>
    <number-input-row data-input='nutritionValue'>Nutrition kcal</number-input-row>
    <text-input-row   data-input='interestingInfo'>Interesting Info</text-input-row>

    <div class='uploader__row--last'></div>
    <button class='button--save save_recipe'>Save</button>
  </div>

    <!-- Existing recipe list wrapper -->
    <div class='uploader__frame recipe_list'>
      <entry-browser data-browser='recipe_browser' class='browser'>Recipes</entry-browser>
    </div>
  
</div> <!-- End of view node -->

<!--/div-->`;

/**
 * 
 */
class RecipeView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mDisplay = 'flex';
        this.mToken   = '';
        this.mRecipeObjects = [];
        this.mProductObjects = [];
        this.mProductMap = {};
        this.mAvailableProducts = [];

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement    = this.shadowRoot.querySelector('.uploader');
        this.mViewNode       = this.shadowRoot.querySelector('.view_node');
        this.mEditorNode     = this.shadowRoot.querySelector('.popup__connector');
        this.mSaveButton     = this.shadowRoot.querySelector('.save_recipe');
        this.mProductMenu    = this.shadowRoot.querySelector('.product_menu');
        this.mBrowser        = this.shadowRoot.querySelector('[data-browser="recipe_browser"]');

        const refreshButton  = this.shadowRoot.querySelector('.button--refresh');
        const inputFrame = this.shadowRoot.querySelector('.uploader__frame[data-input-frame]');
        const inputArray = Array.from(inputFrame.querySelectorAll('[data-input]'));
        this.mInputOperator = new InputOperator('recipe', inputArray);
     
        // ------------------------------
        // - Allergen inputs
        // ------------------------------

        this.mAllergensInput    = this.shadowRoot.querySelector('.allergens_input');
        this.mEggsInput         = this.shadowRoot.querySelector('.eggs_input');
        this.mNutsInput         = this.shadowRoot.querySelector('.nuts_input');
        this.mLactoseInput      = this.shadowRoot.querySelector('.lactose_input');
        this.mGlutenInput       = this.shadowRoot.querySelector('.gluten_input');
   
        // ------------------------------

        /**
         * @listens allergens-added
         */
        this.shadowRoot.addEventListener('allergens-added', e =>
        {
            const product = e.detail.product;

            if ( product && product.hasOwnProperty('hasAllergens'))
            {
                const { 
                    hasAllergens,
                    hasEggs,
                    hasNuts,
                    hasGluten,
                    hasLactose
                } = product;

                console.log(`RecipeView event: allergens-added hasAllergens: ${hasAllergens}`);

                // --------------------------------------
                // - Apply properties only when set
                // --------------------------------------

                if ( hasAllergens ) this.mAllergensInput.turnOn();
                if ( hasEggs )      this.mEggsInput.turnOn();
                if ( hasNuts )      this.mNutsInput.turnOn();
                if ( hasGluten )    this.mGlutenInput.turnOn();
                if ( hasLactose )   this.mLactoseInput.turnOn();
            }
        }, true );

        /**
         * @listens click
         */
        this.mSaveButton.addEventListener('click',
            e =>
            {
                // --------------------------------------
                // - Obtain input values and validate
                // - If dto and image file present, send
                // - To the server
                // --------------------------------------

                const hasSteps = this.mInputOperator.getValue('stepBySteps');
                let embed = { hasStepByStep: false };
                if (hasSteps) embed = { hasStepByStep: true };
                const dto = this.mInputOperator.processInputs( false, embed );
                const imageFile = this.mInputOperator.imageFile();

               // console.log(`Dto title: ${dto.title}, data: ${dto.data}`);
               // console.log(`Imagefile: ${imageFile}`);
               // console.log(`dto.data.hasStepByStep? ${dto.data.hasStepByStep}`);

                if ( dto && imageFile )
                {
                    // -------------------------------------
                    // - Check if dto has steps. If so,
                    // - Call API route /with-steps
                    // -------------------------------------

                    if ( dto.data.hasStepByStep )
                    {
                        
                        // ---------------------------------
                        // - Compile step by step json array
                        // ---------------------------------
                        const stepDto    = { title: 'steps',      data: [] };
                        const stepImages = { title: 'stepImages', images: [] };

                        for (const step of dto.data.stepBySteps)
                        {
                            console.log(`Step ${step}`);
                            stepDto.data.push({text: step.text, stepNumber: step.stepNumber});
                            stepImages.images.push(step.image);
                        }

                        // --------------------------------------
                        // - Remove the stepBySteps data from the
                        // - main recipeDto and
                        // - Compile stringified dto data version
                        // --------------------------------------

                        dto.data.stepBySteps = null;

                        const finalDto = { title: dto.title, data: JSON.stringify(dto.data) };

                        // -----------------------------------------
                        // - Construct also a data stringified final
                        // - version from the child step data
                        // -----------------------------------------

                        const finalStepDto =
                        {
                            title: stepDto.title,
                            data: JSON.stringify(stepDto.data)
                        };

                        const responseNotifier = new ResponseNotifier
                        (
                            'recipeDto',
                            'Create Recipe', 
                            'Recipe Created Succesfully',
                            'Recipe Could Not Be Created' 
                        );
                        this.mRootElement.appendChild( responseNotifier );
                        responseNotifier.onSuccess( 
                            () => {
                                
                                this.loadRecipes();
                                this.mInputOperator.reset();
                            }
                        );
                        responseNotifier.onFail(
                            () => {
                                console.log(`Product could not be added to the server`)
                            }
                        );
                        responseNotifier.begin
                        ( 
                            FileCache.postDtoAndImageWithChildren
                            (
                                RECIPE_URL,
                                finalDto,
                                imageFile,
                                finalStepDto,
                                stepImages
                            )
                        );
                    }
                    else
                    {
                        const finalDto = 
                        { 
                            title: dto.title, 
                            data: JSON.stringify(dto.data)
                        };

                        const responseNotifier = new ResponseNotifier
                        (
                            'recipeDto',
                            'Create Recipe', 
                            'Recipe Created Succesfully',
                            'Recipe Could Not Be Created' 
                        );
                        this.mRootElement.appendChild( responseNotifier );
                        responseNotifier.onSuccess( 
                            () => {
                                
                                this.loadRecipes();
                                this.mInputOperator.reset();
                            }
                        );
                        responseNotifier.onFail(
                            () => {
                                console.log(`Product could not be added to the server`)
                            }
                        );
                        responseNotifier.begin
                        ( 
                            FileCache.postDtoAndImage
                            (
                                RECIPE_URL,
                                finalDto,
                                imageFile
                            )
                        );
                    }
                }
                else
                {
                    console.log(`Add proper data and image file`);
                }
            }
        );

        /**
         * @listens click
         */
        refreshButton.addEventListener('click', e => 
        {
            this.reload();
        });

        // ---------------------------------------------
        // - Listens to an event from the product view
        // - That notifies this view with new list of
        // - Products
        // ----------------------------------------------

        /**
         * @listens product-list
         */
        window.addEventListener('product-list', e => 
        {
            const list = e.detail;

            if (list && Array.isArray(list))
            {
                this.mAvailableProducts = list;
                try  { this.mProductMenu.pushDataSet(list); }
                catch (error) { console.log(`RecipeView ProductMenu init error: ${error}`); }
            }
        }, true);

        // ---------------------------------------------
        // - Read all recipes from the cache of form the
        // - Server
        // ---------------------------------------------

        this.loadRecipes();

    }

    reload()
    {
        FileCache.clearCache(RECIPE_URL);
        this.loadRecipes(); 
    }

    openEditor(entry)
    {
        this.mEditorNode.appendChild
        (
            new RecipeEditor
            (
                entry, 
                this, 
                this.mViewNode,
                this.mAvailableProducts
            )
        );
    }
   /*
    loadProducts()
    {
        console.log(`RecipeView::loadProducts()`);

        this.getProducts()
            .then(response => 
            {console.log(`Product response: ${response.text}`);    
                try {
                    //const list = JSON.parse(data);
                    //if ( list ) this.generateList(list);
                } catch (error) {}
            })
            .catch(error => 
            {
                console.log(`Could not read products: ${error}`);
            });
    }*/

  
    /**
     * Generates the list of existing recipes
     * --------------------------------------
     * 
     * @param {array} list 
     */
    generateList(list)
    {
        console.log(`RecipeView::generateList() -- Recipe amount: ${list.length}`);

        const model = {
            titlekey: 'title',
            fields: [
                'monthsOld',
                'preparationTimeInMinutes',
                'cookTimeInMinutes',
                'instructions',
                'storageInfo',
                'originalRecipeLink',
                'mediaDto'
            ]
        };
      
        this.mBrowser.pushDataSet(list, model);

      
        /**{
                    this.mViewNode.style.display = 'none';
                    const editor = new RecipeEditor(recipe, this, this.mViewNode, this.mAvailableProducts);
                    this.mEditorNode.appendChild(editor);
        }**/

    }

   /**
    * Read recipes from cache or from server
    * --------------------------------------
    */
    loadRecipes()
    {
        this.getRecipes()
            .then(response => 
            {   
                console.log(`GET /recipes response status: ${response.status}`);

                if (response.ok)
                {
                    console.log(`Response ok, parse the recipes`);
                    try { this.generateList( JSON.parse(response.text)); } 
                    catch (error) { throw new Error(`Recipe parse failed: ${error}`); }
                }
                else throw new Error(`Server responded with: ${response.text}`);
     
            })
            .catch(error => { console.log(`${error}`); });
    }
    
    /**
     * Builds and executes the getProducts HTTP Request
     * ------------------------------------------------
     */
    getRecipes()
    {         
        return FileCache.getCached(RECIPE_URL);
    }

    /**
     * Builds and executes the addRecipe HTTP Request
     * Returns response properties in an object:
     * - {boolean} ok 
     * - {number}  status
     * - {string}  text
     * -----------------------
     * @param  {RecipetDto} dto 
     * @param  {File}       imageFile
     * @return {boolean, number, string}
     */
    addRecipe(dto, imageFile)
    {
        return FileCache.postDtoAndImage(RECIPE_URL, dto, imageFile);
    }

    /**
     * Builds and executes API addRecipeWithSteps route
     * Returns response properties in an object:
     * - {boolean} ok 
     * - {number}  status
     * - {string}  text
     * -----------------------
     * @param  {RecipeDto} dto 
     * @param  {File}      imageFile
     * @param  {Array}     stepDtoList
     * @param  {Array}     stepImageList
     * @return {boolean, number, string}
     */
    addRecipeWithSteps(dto, imageFile, stepDtoList, stepImageList)
    {
        return FileCache.postDtoAndImageWithChildren
        (
            `${RECIPE_URL}/with-steps`, 
            dto, 
            imageFile,
            stepDtoList,
            stepImageList
        );
    }

    /**
     * Executes HTTP DELETE by recipe route / id
     * -----------------------
     * @param  {integer} id
     * @return {Promise} response
     */
    removeRecipe(id)
    {
        console.log(`Remove recipe ${id} called`);
        const responseNotifier = new ResponseNotifier
        ( 
            'recipeDto',
            'Remove Recipe', 
            'Recipe Removed Succesfully',
            'Recipe Could Not Be Removed' 
        );
        this.mRootElement.appendChild( responseNotifier );

        responseNotifier.onSuccess
        ( 
            () => {            
                this.loadRecipes();
            }
        );
        responseNotifier.onFail
        (
            () => {
                console.log(`Product could not be removed`)
            }
        );
        responseNotifier.begin( FileCache.delete( RECIPE_URL, id ) );
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        /**
         * Listen to remove events
         */
        this.shadowRoot.addEventListener('remove-by-id', e =>
        {
            const id = e.detail.entry.id;

            e.preventDefault();
            e.stopPropagation();

            console.log(`RecipeView: remove-by-id ${id}`);

            this.removeRecipe(id);

        }, true);

        /**
         * @listens edit-by-id
         */
        this.shadowRoot.addEventListener('edit-by-id', e =>
        {
             const entry = e.detail.entry;
 
             e.preventDefault();
             e.stopPropagation();
 
             console.log(`RecipeView: edit-by-id ${entry.id} event intercepted. Open the editor for the recipe`);
 
            this.openEditor(entry);
            //this.openEditor(id);
 
        }, true);

        this.shadowRoot.addEventListener('recipe-edit-ok', e => 
        {
            this.reload();
        }, true);

        
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define('recipe-view', RecipeView);

export { RecipeView };