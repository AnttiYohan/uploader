import 
{
    RECIPE_URL, 
    UPDATE_PRODUCTS_URL,
    UPDATE_PRODUCTS_ADD_URL, 
    UPDATE_STEPS_URL,
    UPDATE_STEPS_ADD_URL

} from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EditorBase } from './EditorBase.js';
import { EditorList } from './EditorList.js';
import { EditorStepList } from './EditorStepList.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { EditorBinaryLabel } from './EditorBinaryLabel.js';
import { EditorSwitchGroup } from './EditorSwitchGroup.js';
import { EditorProductList } from './EditorProductList.js';


/**
 * Recipe Editor View  
 */
class RecipeEditor extends EditorBase
{
    /**
     * Recipe Editor Constructor function 
     * ------
     * @param {Object}      recipeDto, holds the data of selected recipe 
     * @param {Context}     parent, recipe view 
     * @param {HTMLElement} viewNode, the recipe view root node 
     * @param {Array}       availableProducts, currently available products 
     */
    constructor( recipeDto, parent, viewNode, availableProducts )
    {
        const template = 
        `<div class='editor__component'>
            <editor-label data-label='title'>Current</editor-label> 
            <text-input-row data-input='title'>New Title</text-input-row>
        </div>
        <div class='editor__component'>
            <editor-image data-label='mediaDto'>Current Image</editor-image>
            <image-input-row data-input='mediaDto'>New Image</image-input-row>
        </div>
        <div class='editor__component'>
            <editor-label data-label='originalRecipeLink'>Current Link</editor-label>
            <text-input-row data-input='originalRecipeLink'>New Recipe Link</text-input-row>
        </div> 
        <div class='editor__component'>
            <editor-label    data-label='youtubeVideoLink'>Current Video Link</editor-label>
            <text-input-row  data-input='youtubeVideoLink'>Video Link</text-input-row>
        </div>
        <div class='editor__component'>
            <editor-label     data-label='monthsOld'>Current Age</editor-label>
            <number-input-row data-input='monthsOld' unit='Months'>New Age</number-input-row>
        </div>
        <div class='editor__component'>
            <editor-label     data-label='prepareTimeInMinutes'>Current Prepare Time</editor-label>
            <number-input-row data-input='prepareTimeInMinutes' unit='Min'>New Preparation time</number-input-row>
        </div>
        <div class='editor__component'>
            <editor-label     data-label='cookTimeInMinutes'>Current Cooking Time</editor-label>
            <number-input-row data-input='cookTimeInMinutes' unit='Min'>New Cooking Time</number-input-row>
        </div>
        <div class='editor__component'>
            <editor-label    data-label='instructions'>Current Instructions</editor-label>
            <text-input-area data-input='instructions'>New Instructions</text-input-area>
        </div>
        <div class='editor__component'>
            <editor-label    data-label='storageInfo'>Current Storage Info</editor-label>
            <text-input-area data-input='storageInfo'>New Storage Info</text-input-area>
        </div>
        <div class='editor__component'>
            <editor-label     data-label='nutritionValue'>Current Nutrition Value</editor-label>
            <number-input-row data-input='nutritionValue'>New Nutrition Value</number-input-row>
        </div>
        <div class='editor__component'>
            <editor-label    data-label='interestingInfo'>Current Interesting Info</editor-label>
            <text-input-row  data-input='interestingInfo'>New Interesting Info</text-input-row>
        </div>
        <div class='editor__component'>
            <editor-switch-group data-label='season'>Selected Seasons</editor-switch-group>
            <binary-switch-group class='season_input' data-input='season' data-null group='[
            { "title": "Winter", "value": "WINTER" }, 
            { "title": "Spring", "value": "SPRING" },
            { "title": "Summer", "value": "SUMMER" },
            { "title": "Autumn", "value": "AUTUMN" },
            { "title": "All", "value": "ALL", "fill": true }
            ]'>Season</binary-switch-group>
        </div>
        <div class='editor__component'>
            <editor-binary-label data-label='fingerFood'>Current</editor-binary-label>
            <binary-button-row data-input='fingerFood'>Fingerfood</binary-button-row>
        </div>
        <div class='editor__component'>
            <editor-binary-label data-label='hasToCook'>Current</editor-binary-label>
            <binary-button-row data-input='hasToCook'>Has To Cook</binary-button-row>
        </div>
        <binary-button-row data-input='allergens' blocked>Allergens</binary-button-row>
        <binary-button-row class='eggs_input' blocked>Has Eggs</binary-button-row>
        <binary-button-row class='nuts_input' blocked>Has Nuts</binary-button-row>
        <binary-button-row class='lactose_input' blocked>Has Lactose</binary-button-row>
        <binary-button-row class='gluten_input' blocked>Has Gluten</binary-button-row>
        <!-- RECIPE MEALTYPES MULTISELECTION -->
        <div class='editor__component'>
            <editor-switch-group data-label='mealTypes'>Current Meal Types</editor-switch-group>
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
        </div>
        <div class='editor__component'>
            <editor-list data-label='tips'>Current Tips</editor-list>
            <multi-entry-row data-input='tips'>Tips</multi-entry-row>
        </div>
        <button class='button update update--one-to-one'>Update</button>
        <!-- Product add input -->
        <div class='editor__component products'>
            <editor-product-list data-label='products'>Saved Products</editor-product-list>
            <event-bouncer data-emitters='["product-select"]'>
                <ingredient-menu data-connect='host' class='product_menu' data-emit='product-select'>Edit product list:</ingredient-menu>
                <product-store data-input='products' data-connect='slave'>Ingredients</product-store>
            </event-bouncer>
            <div class='two_column'>
                <binary-button-row data-yes='Add' data-no='Replace' class='product-mode column__item'></binary-button-row>
                <button class='button update update--products'>Update</button>
            </div>
        </div>
        <div class='editor__component steps'>
            <editor-step-list data-label='steps'></editor-step-list>
            <step-store data-input='steps'>Steps</step-store>
            <div class='two_column'>
                <binary-button-row data-yes='Add' data-no='Replace' class='step-mode column__item'></binary-button-row>
                <button class='button update update--steps'>Update</button>
            </div>
        </div>`;
        
        const style =     
        `.two_column .button { margin: auto; }
        .two_column .column__item { margin-bottom: 16px; }`;
    
                
        /**
         * Pass to the parent
         * - Entity key
         * - dto
         * - parent
         * - viewNode
         * - update url
         * - options { relatedSet, template, style }
         */
        super
        (
            'recipe', 
            recipeDto, 
            parent, 
            viewNode, 
            RECIPE_URL, 
            {
                template,
                style, 
                relatedSet: availableProducts
            } 
        ); 
    
        /**
         * Listen to Product update button
         * ------
         */
        const productsUpdateButton = this.mDataInputFrame.querySelector('.update--products');
        productsUpdateButton.addEventListener('click', e =>
        {
            this.mClickedButton = productsUpdateButton;

            const products    = this.mInputOperator.getUpdateProductListDto();
            const modeElement = this.mDataInputFrame.querySelector('.product-mode');

            const add = modeElement && modeElement.value
                      ? true
                      : false;

            console.log( `Products serialized: ${products}, addmode: ${add}` );

            if ( products.length ) this.updateRecipeProducts( products, add );
            
        });

        /**
         * Listen to Steps update button
         * ------
         */
        const stepsUpdateButton = this.mDataInputFrame.querySelector('.update--steps');
        stepsUpdateButton.addEventListener( 'click', e =>
        {
            this.mClickedButton = stepsUpdateButton;
            
            const steps = this.mInputOperator.getUpdateStepListDto();
            const modeElement = this.mDataInputFrame.querySelector('.step-mode');

            const add = modeElement && modeElement.value
                    ? true
                    : false;

            console.log(`Steps serialized: ${steps.dto.data}, addmode: ${add}`);

            if ( steps.dto.data.length ) this.updateRecipeSteps( steps, add );
        });
    }

    /**
     * Hadnles the recipe product updating HTTP Request and
     * routes the response to an appropriate handler function
     * 
     * @param {string}  serialized 
     * @param {boolean} addmode 
     */
    async updateRecipeProducts( serialized, addmode )
    {
        const offsetTop  = Number(this.mClickedButton.offsetTop - 200);
        const offsetLeft = Number(this.mClickedButton.offsetLeft);
    
        const responseNotifier = new ResponseNotifier
        (
            'products',
            'Update Recipe Products', 
            'Products Updated Succesfully',
            'Product Could Not Be Updated',
            { top: `${offsetTop}px`, left: `20px` }
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( products => this.mInputOperator.reloadProductStore( products ) );
        responseNotifier.onFail( ( status, message ) => 
            console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`) 
        );
        responseNotifier.begin
        ( 
            FileCache.updateDto
            (
                addmode ? UPDATE_PRODUCTS_ADD_URL : UPDATE_PRODUCTS_URL,
                serialized,
                responseNotifier
            )
        );
    }

    /**
     * Executes the step update request and
     * routes the response to the appropriate handler 
     * 
     * @param {array}   steps 
     * @param {boolean} addmode 
     */
    async updateRecipeSteps( steps, addmode )
    {
        const offsetTop  = Number(this.mClickedButton.offsetTop - 200);
    
        const responseNotifier = new ResponseNotifier
        (
            'steps',
            'Update Recipe Steps', 
            'Steps Updated Succesfully',
            'Steps Could Not Be Updated',
            { top: `${offsetTop}px`, left: `20px` }
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( steps => this.mInputOperator.reloadStepStore( steps ) );
        responseNotifier.onFail( ( status, message ) =>
            console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`) 
        );
        responseNotifier.begin
        ( 
            FileCache.updateDtoAndImageList
            (
                addmode ? UPDATE_STEPS_ADD_URL : UPDATE_STEPS_URL,
                steps.dto,
                steps.images,
                responseNotifier
            )
        );           
    }
}

window.customElements.define( 'recipe-editor', RecipeEditor );

export { RecipeEditor };