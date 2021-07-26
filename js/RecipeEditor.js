import 
{
     WCBase,
     props,
     UPDATE_RECIPE_URL, 
     UPDATE_FIELDS_URL, 
     UPDATE_PRODUCTS_URL,
     UPDATE_PRODUCTS_ADD_URL, 
     UPDATE_STEPS_URL,
     UPDATE_STEPS_ADD_URL

} from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EditorList } from './EditorList.js';
import { EditorLabel } from './EditorLabel.js';
import { EditorImage } from './EditorImage.js';
import { TextInputRow } from './TextInputRow.js';
import { InputOperator } from './util/InputOperator.js';
import { TextInputArea } from './TextInputArea.js';
import { ImageInputRow } from './ImageInputRow.js';
import { NumberInputRow } from './NumberInputRow.js';
import { EditorStepList } from './EditorStepList.js';
import { BinaryButtonRow } from './BinaryButtonRow.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { BinarySwitchGroup } from './BinarySwitchGroup.js';
import { EditorBinaryLabel } from './EditorBinaryLabel.js';
import { EditorSwitchGroup } from './EditorSwitchGroup.js';
import { EditorProductList } from './EditorProductList.js';

/**
 * Recipe Editor View  
 */
class RecipeEditor extends WCBase
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
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mRecipeId          = recipeDto.id;
        this.mRecipeDto         = recipeDto;
        this.mParentContext     = parent;
        this.mViewNode          = viewNode;
        this.mAvailableProducts = availableProducts;
    
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate(
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='notifier'></div>
         <div class='editor' data-input-frame>
            <div class='editor__component'>
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
                <product-row data-connect='slave' data-input='products' data-collect='product-select'></product-row>
                </event-bouncer>
                <div class='two_column'>
                    <binary-button-row data-yes='Add' data-no='Replace' class='product-mode column__item'></binary-button-row>
                    <button class='button update update--products'>Update</button>
                </div>
            </div>
            <div class='editor__component steps'>
                <editor-step-list data-label='steps'></editor-step-list>
                <step-editor data-input='steps'></step-editor>
                <div class='two_column'>
                    <binary-button-row data-yes='Add' data-no='Replace' class='step-mode column__item'></binary-button-row>
                    <button class='button update update--steps'>Update</button>
                </div>
            </div>
            <button class='button exit'>Exit</button>
        </div>`);

        this.setupStyle
        (`
        .update--one-to-one { margin-top: 32px; margin-bottom: 42px; display: block; }
        .notifier { position: absolute; }
        .dialog { top: 1000px; z-index:1; }
        .editor { max-width: 1200px; margin: 24px auto; padding: 0; box-shadow: 0 0 4px -1px rgba(0,0,0,.25); border-radius: 24px; border: 6px solid #abd; }
        .two_column .button { margin: auto; }
        .two_column .column__item { margin-bottom: 16px; }
        `);

        this.mRootElement    = this.shadowRoot.querySelector( '.notifier' );
        const dataInputFrame = this.shadowRoot.querySelector( '[data-input-frame]' );
        this.mInputOperator  = new InputOperator( 'recipe', Array.from(dataInputFrame.querySelectorAll('[data-input]')));
        this.mInputOperator.setComponentFrame( dataInputFrame );
        this.mInputOperator.loadComponents
        (
            Array.from( dataInputFrame.querySelectorAll( '.editor__component' ) ),
            recipeDto,
            availableProducts
        );

        const exitButton = this.shadowRoot.querySelector( '.button.exit' );
        exitButton.addEventListener
        ( 'click', e => 
        { 
            this.closeEditor();
        });

        /**
         * HTMLElement, use this to store the clicked
         * button into it
         */
        this.mClickedButton = null;

        /**
         * Listen to update--one-to-one button
        */
        const updateButton = dataInputFrame.querySelector('.update--one-to-one');
        updateButton.addEventListener( 'click', e => 
        {
            /**
             * Store the reference into the clickedbutton
             */
            this.mClickedButton = updateButton;

            const image = this.mInputOperator.getUpdateImage();

            /**
             * No Image To Update,
             * Send a request with key-value pairs
             */
            if ( ! image )
            {
                const data = this.mInputOperator.getUpdateRecipe();
                return data.length ? this.updateRecipe(data) : '';
            }

            /**
             * Serialize the dto
             * Pass the Image with dto data
             * Into a multipart request builder
             */
            const data =  this.mInputOperator.getUpdateRecipe();
            
            if ( ! data && ! image ) return;

            this.updateRecipeImage( { 'title': 'recipe', data }, image);
                    
        });

        /**
         * Listen to Product update button
         * ------
         */
        const productsUpdateButton = dataInputFrame.querySelector('.update--products');
        productsUpdateButton.addEventListener('click', e =>
        {
            this.mClickedButton = productsUpdateButton;

            const products = this.mInputOperator.getUpdateProductListDto();
            const modeElement = dataInputFrame.querySelector('.product-mode');

            const add = modeElement && modeElement.value
                      ? true
                      : false;

            console.log(`Products serialized: ${products}, addmode: ${add}`);

            if ( products.length ) this.updateRecipeProducts( products, add );
            
        });

        /**
         * Listen to Steps update button
         * ------
         */
        const stepsUpdateButton = dataInputFrame.querySelector('.update--steps');
        stepsUpdateButton.addEventListener('click', e =>
        {
            this.mClickedButton = stepsUpdateButton;
            
            const steps = this.mInputOperator.getUpdateStepListDto();
            const modeElement = dataInputFrame.querySelector('.step-mode');

            const add = modeElement && modeElement.value
                    ? true
                    : false;

            console.log(`Steps serialized: ${steps.dto.data}, addmode: ${add}`);

            if ( steps.dto.data.length ) this.updateRecipeSteps( steps, add );
        });
    }

    /**
     * Handles the Respone Promise
     * @param {Promise} promise 
     */
    responseHandler(response)
    {
        console.log(`Recipe update response: ${response.status}`);
                    console.log(`Response: ${response.text}`);
                    
                    //this.closeEditor(response);
        
    }

    /**
     * Updae methods for recipe 1:1 fields
     * @param   {object} dto 
     * @return 
     */
    async updateRecipe( dto )
    {
        const offsetTop  = Number(this.mClickedButton.offsetTop - 200);
        const offsetLeft = Number(this.mClickedButton.offsetLeft);
        const responseNotifier = new ResponseNotifier
        (
            'recipeDto',
            'Update Recipe', 
            'Recipe Updated Succesfully',
            'The Recipe Could Not Be Updated',
            { top: `${offsetTop}px`, left: `${offsetLeft}px` }
        );
        //this.mViewNode.appendChild( responseNotifier );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( 
            ( recipe ) => {
                this.mInputOperator.reloadEditor( recipe );
                this.mInputOperator.reset();
            }
        );
        responseNotifier.onFail(
            ( status, message ) => {
                console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`);
            }
        );
        responseNotifier.begin
        ( 
            FileCache.putDto
            (
                UPDATE_RECIPE_URL,
                dto
            ) 
        ); 
    }

    /**
     * 
     * @param  {string} serialized 
     * @param  {File}   image 
     */
    async updateRecipeImage( serialized, image )
    {
        if ( ! image ) return;

        const responseNotifier = new ResponseNotifier
        (
            'recipeDto',
            'Update Recipe With Image', 
            'Recipe Updated Succesfully',
            'The Recipe Could Not Be Updated' 
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( 
            ( recipe ) => {
                this.mInputOperator.reloadEditor( recipe );
            }
        );
        responseNotifier.onFail(
            ( status, message ) => {
                console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`);
            }
        );
        responseNotifier.begin
        ( 
            FileCache.putDtoAndImage
            (
                UPDATE_FIELDS_URL, 
                serialized, 
                image
            )
        ); 
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
            { top: `${offsetTop}px`, left: `200px` }
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess
        ( 
            products => 
            {
                this.mInputOperator.reloadProductMenu( products );
            }
        );
        responseNotifier.onFail(
            ( status, message ) => {
                console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`);
            }
        );
        responseNotifier.begin
        ( 
            addmode
            ? await FileCache.putDto
            (
                UPDATE_PRODUCTS_ADD_URL,
                serialized
            )
            : await FileCache.putDto
            (
                UPDATE_PRODUCTS_URL,
                serialized
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
        const offsetLeft = Number(this.mClickedButton.offsetLeft);
    
        const responseNotifier = new ResponseNotifier
        (
            'steps',
            'Update Recipe Steps', 
            'Steps Updated Succesfully',
            'Steps Could Not Be Updated',
            { top: `${offsetTop}px`, left: `200px` }
        );
        this.mRootElement.appendChild( responseNotifier );
        responseNotifier.onSuccess( steps  => { this.mInputOperator.reloadStepEditor( steps ) } );
        responseNotifier.onFail(
            ( status, message ) => {
                console.log(`RecipeEditor::update recipe fail: status ${status}, ${message}`);
            }
        );
        responseNotifier.begin
        ( 
            addmode
            ? await FileCache.putDtoAndImageList
            (
                UPDATE_STEPS_ADD_URL,
                steps.dto,
                steps.images
            )
            : await FileCache.putDtoAndImageList
            (
                UPDATE_STEPS_URL,
                steps.dto,
                steps.images
            )
        );           
    }

    /**
     * Closes the editor, if response is set,
     * Send it as a detail with 'recipe-edit-ok'-event
     * @param {boolean} response 
     */
    closeEditor( response = undefined )
    {
        if ( response ) this.emit( 'recipe-edit-ok', { response } );
        this.remove();
        delete this;
    }

    /**
     * 
     * @param {object} dto 
     */
    dtoTest( dto )
    {
        for ( const key in dto )
        {
            console.log( `Set: ${key}: ${dto[key]}` );
        }
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        /**
         * Turn the parent view off for now
         */
        this.mViewNode.style.display = 'none';

    }

    disconnectedCallback()
    {
        /**
         * Turn the parent view on again
         */
        this.mViewNode.style.display = 'flex';
    }  

}

window.customElements.define( 'recipe-editor', RecipeEditor );

export { RecipeEditor };