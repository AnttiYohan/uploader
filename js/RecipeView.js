import { WCBase, props, RECIPE_URL, PRODUCT_URL, MEALTYPES_ENUM, MEASURE_UNIT_ENUM } from './WCBase.js';
import { RecipeEditor } from './RecipeEditor.js';
import { StepEditor } from './StepEditor.js';
import { ProductRow } from './ProductRow.js';
import { ProductList } from './ProductList.js';
import { EventBouncer } from './EventBouncer.js';
import { TextInputRow } from './TextInputRow.js';
import { TextInputArea } from './TextInputArea.js';
import { InputOperator } from './util/InputOperator.js';
import { ImageInputRow } from './ImageInputRow.js';
import { MultiEntryRow } from './MultiEntryRow.js';
import { NumberInputRow } from './NumberInputRow.js'
import { BinaryButtonRow } from './BinaryButtonRow.js';
import { BinarySwitchGroup } from './BinarySwitchGroup.js';
import 
{ 
    newTagClass, 
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    newTagClassAttrs, 
    numberInputClass,
    selectValue,
    selectClassIdOptionList,
    setImageFileInputThumbnail
} from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <!--div-->
  <!-- The editor is connected here when utilized -->

  <div class='popup__connector'>
  </div>
  
  <!-- Wrapper for the whole recipe view, display set to none while in editor -->
  <div class='uploader view_node'>

  <!-- New Recipe Frame -->
  <div class='uploader__frame' data-input-frame>

    <!-- REFRESH ROW -->

    <button class='button--refresh'>Refresh</button>

    <!-- Input's begin -->

    <text-input-row  class='title_input' data-input='title' required>Title</text-input-row
    <image-input-row class='image_input' data-input='image'>Recipe Image</image-input-row>
    <text-input-row  class='link_input'  data-input='originalRecipeLink' required>Recipe Link</text-input-row> 
    <text-input-row  class='youtube_input' data-input='youtubeVideoLink'>Video Link</text-input-row>
    <number-input-row class='age_input' data-input='monthsOld' unit='Months' required>Age</number-input-row>
    <number-input-row class='prep_time_input' data-input='prepareTimeInMinutes' unit='Min' required>Preparation time</number-input-row>
    <number-input-row class='cook_time_input' data-input='cookTimeInMinutes' unit='Min' required>Cook time</number-input-row>

    <!-- Product add input -->
    <event-bouncer data-emitters='["product-select"]'>
        <content-browser data-connect='host' class='product-input' 
                         data-input='productsMenu'
                         data-emit='product-select'
        >Products:</content-browser>
        <product-row data-connect='slave' data-input='products' data-collect='product-select'></product-row>
    </event-bouncer>
    
    <text-input-area class='instructions_input' data-input='instructions' required>Instructions</text-input-area>
    <text-input-area class='storage_input' data-input='storageInfo' required>Storage</text-input-area>

    <!-- RECIPE SEASON RADIO SELECTION -->

    <binary-switch-group class='season_input' data-input='season' data-null='no' group='[
        { "title": "Winter", "value": "WINTER" }, 
        { "title": "Spring", "value": "SPRING" },
        { "title": "Summer", "value": "SUMMER" },
        { "title": "Autumn", "value": "AUTUMN" },
        { "title": "All", "value": "ALL", "rule": "fill" }
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

    <!-- NON MANDATORY INPUT SET -->

    <multi-entry-row  data-input='tips'>Tips</multi-entry-row>
    <number-input-row data-input='nutritionValue'>Nutrition kcal</number-input-row>
    <text-input-row   data-input='interestingInfo'>Interesting Info</text-input-row>

    <!-- SAVE BUTTON -->

    <div class='uploader__row--last'>
    </div>

    <button class='button--save save_recipe'>Save</button>
    
  </div>


  <!-- Existing recipe list wrapper -->

    <div class='uploader__frame recipe_list'>
      <content-browser data-input='browser' class='browser'>Recipes</content-browser>
    </div>
  
  </div> <!-- End of recipe view wrapper -->

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

        console.log(`RecipeView::constructor called`);
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .popup__connector {
            width: 0;
            height: 0;
        }
        .flex__row {
            display: flex;
            flex-wrap: wrap:
        }
        .uploader__button--edit {
            cursor: pointer;
            margin: 16px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_edit.svg');
            background-repeat: no-repeat;
            background-origin: center;
        }
        .uploader__button--delete {
            cursor: pointer;
            margin: 16px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_cancel.svg');
            background-repeat: no-repeat;
            background-origin: center;
        }
        .uploader__button--refresh {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_refresh.svg');
            background-repeat: no-repeat;
            background-origin: center;
        }
        .mg-vt-left-16
        {
            margin-top: 16px;
            margin-bottom: 16px;
            margin-left: 16px;
            margin-right: 0;
        }
        .uploader__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        .list__item {
            display: flex;
            justify-content: space-between;
            height: 64px;
        }
        .list__paragraph {
            text-align: center;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            margin: 16px;
            padding: 8px ${props.text_vt_pad};
        }
        .list__thumbnail {
            width: 48px;
            height: 48px;
            align-self: center;
            border-radius: 4px;
            box-shadow: 0 1px 15px 0px rgba(0,0,0,0.25);
        }
        @media (max-width: ${props.uploader_max_width}) 
        {
            .uploader  {
                flex-direction: column;
            }
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement    = this.shadowRoot.querySelector('.uploader');
        this.mViewNode       = this.shadowRoot.querySelector('.view_node');
        this.mEditorNode     = this.shadowRoot.querySelector('.uploader__frame.editor_node');
        this.mSaveButton     = this.shadowRoot.querySelector('.save_recipe');
        this.mRecipeList     = this.shadowRoot.querySelector('.uploader__frame.recipe_list');
        this.mStepEditor     = this.shadowRoot.querySelector('.step_editor');
        this.mIngredientList = this.shadowRoot.querySelector('.ingredient_list');

        const refreshButton  = this.shadowRoot.querySelector('.button--refresh');

        const inputFrame = this.shadowRoot.querySelector('.uploader__frame[data-input-frame]');
        const inputArray = Array.from(inputFrame.querySelectorAll('[data-input]'));

        this.mInputOperator = new InputOperator('recipes', inputArray);
        console.log(`RecipeView: InputArray lenght: ${inputArray.length}`);


        // ---------------------------
        // - Listen to the step editor
        // - Connected callback
        // ---------------------------

        this.addEventListener("stepeditorconnected", e => 
        {
            console.log(`step editor connected callback catched`);
        }, true);

        // ------------------
        // - Input references
        // ------------------

        this.mTitleInput        = this.shadowRoot.querySelector('.title_input');
        this.mFileInput         = this.shadowRoot.querySelector('.image_input');
        this.mAgeInput          = this.shadowRoot.querySelector('.age_input');
        this.mLinkInput         = this.shadowRoot.querySelector('.link_input');
        this.mVideoInput        = this.shadowRoot.querySelector('.youtube_input');
        this.mPrepTimeInput     = this.shadowRoot.querySelector('.prep_time_input');
        this.mCookTimeInput     = this.shadowRoot.querySelector('.cook_time_input');
        this.mInstructionsInput = this.shadowRoot.querySelector('.instructions_input');
        this.mStorageInput      = this.shadowRoot.querySelector('.storage_input');
        this.mSeasonInput       = this.shadowRoot.querySelector('.season_input');
        this.mFingerfoodInput   = this.shadowRoot.querySelector('.fingerfood_input');
        this.mCookInput         = this.shadowRoot.querySelector('.has_to_cook_input');
        this.mAllergensInput    = this.shadowRoot.querySelector('.allergens_input');
        this.mEggsInput         = this.shadowRoot.querySelector('.eggs_input');
        this.mNutsInput         = this.shadowRoot.querySelector('.nuts_input');
        this.mLactoseInput      = this.shadowRoot.querySelector('.lactose_input');
        this.mGlutenInput       = this.shadowRoot.querySelector('.gluten_input');
        this.mMealTypeInput     = this.shadowRoot.querySelector('.meal_types_input');
  
        // -----------------------------------------------
        // - Non mandatory input set
        // -----------------------------------------------

        this.mTipsInput         = this.shadowRoot.querySelector('.tips_input');
        this.mNutritionInput    = this.shadowRoot.querySelector('.nutrition_input');
        this.mInfoInput         = this.shadowRoot.querySelector('.info_input');

        // ------------------------------
        // ------------------------------
        // - Setup button click listeners
        // ------------------------------

        this.mSaveButton.addEventListener
        (
            'click',
            e =>
            {
                // --------------------------------------
                // - Obtain input values and validate
                // - If dto and image file present, send
                // - To the server
                // --------------------------------------

                const dto       = this.compileDto();
                const imageFile = this.mFileInput.value;

                console.log(`Dto title: ${dto.title}, data: ${dto.data}`);
                console.log(`Imagefile: ${imageFile}`);
                console.log(`dto.data.hasStepByStep? ${dto.data.hasStepByStep}`);

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
                        const stepDto = { title: 'steps', data: []};
                        const stepImage = { title: 'stepImages', images: []};

                        for (const step of dto.data.stepBySteps)
                        {
                            console.log(`Step ${step}`);
                            stepDto.data.push({text: step.text, stepNumber: step.stepNumber});
                            stepImage.images.push(step.image);
                        }

                        // --------------------------------------
                        // - Remove the stepBySteps data from the
                        // - main recipeDto and
                        // - Compile stringified dto data version
                        // --------------------------------------

                        dto.data.stepBySteps = null;

                        const finalDto = 
                        { 
                            title: dto.title, 
                            data: JSON.stringify(dto.data)
                        };

                        // -----------------------------------------
                        // - Construct also a data stringified final
                        // - version from the child step data
                        // -----------------------------------------

                        const finalStepDto =
                        {
                            title: stepDto.title,
                            data: JSON.stringify(stepDto.data)
                        };

                        this.addRecipeWithSteps(finalDto, imageFile, finalStepDto, stepImage)
                            .then(response =>
                            {
                                console.log(`addRecipeWithSteps response: ${response}`);
                                this.loadRecipes();
                            })
                            .catch(error =>
                            {
                                console.log(`addRecipeWithSteps fail: ${error}`);
                            });

                    }
                    else
                    {
                        dto.data.stepBySteps = null;

                        const finalDto = 
                        { 
                            title: dto.title, 
                            data: JSON.stringify(dto.data)
                        };

                        this.addRecipe(finalDto, imageFile)
                            .then(response => 
                            {
                                console.log(`addRecipe response ok: ${response}`);
                                this.loadRecipes();
                            })
                            .catch(error => 
                            {
                                console.log(`addRecipe response fail: ${error}`);
                            });
                    }
                }
                else
                {
                    console.log(`Add proper data and image file`);
                }
            }
        );

        refreshButton.addEventListener('click', e => 
        {
             FileCache.clearCache(RECIPE_URL);
             this.loadRecipes(); 
        });

        // ---------------------------------------------
        // - Read all recipes from the cache of form the
        // - Server
        // ---------------------------------------------

        this.loadRecipes();


        // ---------------------------------------------
        // - Listens to an event from the product view
        // - That notifies this view with new list of
        // - Products
        // ----------------------------------------------

        window.addEventListener('product-list', e => 
        {
            const list = e.detail;

            if (list && Array.isArray(list))
            {
                const menu = this.mInputOperator.getInput('productsMenu');

                console.log(`RecipeView, init product-menu: ${menu.dataset.input} with ${list}`);
                
                try  {
                
                    menu.pushDataSet(list);

                } catch (error) {
                    console.log(`RecipeView product menu init error: ${error}`);
                }
            }
        }, true);
    }

    /**
     * Update the internal product list
     * 
     * @param {array} products 
     */
    setProductObjects(products)
    {
        // --------------------------------------
        // - Store available product list so that
        // - it may be passed to the
        // - Recipe editor in its entirety
        // --------------------------------------

        this.mAvailableProducts = products;

        console.log(`Product list received at recipeview, size: ${products.length}`);
        deleteChildren(this.mIngredientsInput);

        for (const product of products)
        {
            const option = newTagClassAttrs
            (
                "option", 
                "uploader__option", 
                {"data-id":product.id}, 
                product.name
            );
            option.value = product.id;

            this.mIngredientsInput.appendChild(option);
        }

        this.mIngredientsInput.addEventListener
        (
            "change",
            e =>
            {
                const value = e.target.value;

                // --------------------------------------
                // - Go through the objects, find out if
                // - The the product is chosen
                // --------------------------------------

                console.log(`Ingredients list children: ${this.mIngredientsList.children.length}`);

                for (const elem of this.mIngredientsList.children)
                {
                    if (elem.getAttribute('data-id') === value)
                    {
                        console.log(`The object is already chosen`);
                        return;
                    }
                }

                let product = null;

                for (const p of products)
                {
                    console.log(`product: ${p} - ${value}`);
                    if (Number(p.id) === Number(value))
                    {
                        product = p;
                        break;
                    }
                }

                if (! product)
                {
                    console.log(`The chosen product wasn't in the product object list`);
                    return;
                }

                const
                uploaderItem = newTagClassAttrs("div", "ingredient__frame", {"data-id":value});

                const 
                removeButton = newTagClass("div", "ingredient__button--remove");
                removeButton.addEventListener
                (
                    "click",
                    inner =>
                    {
                        uploaderItem.remove();
                    }  
                );

                uploaderItem.appendChild
                (
                    newTagClassChildren
                    (
                        "div",
                        "ingredient__row",
                        [
                            removeButton,
                            newTagClassHTML("div", "ingredient__title", product.name),
                            numberInputClass("ingredient__amount"),
                            selectClassIdOptionList("ingredient__unit", "", MEASURE_UNIT_ENUM)
                        ]
                    ) 
                );
                uploaderItem.appendChild(newTagClassHTML("div", "ingredient__category", product.productCategory));

                this.mIngredientsList.appendChild( uploaderItem );
            }
        );
    }

    loadProducts()
    {
        console.log(`RecipeView::loadProducts()`);

        this
            .getProducts()
            .then(data => {

                console.log(`Product response: ${data}`);
                
                try {
                
                    const list = JSON.parse(data);

                    console.log(`PArsed data: ${list}`);

                    if ( list ) this.generateList(list);

                } catch (error) {}
            })
            .catch(error => {

                console.log(`Could not read products: ${error}`);

            });
    }

    /**
     * Returns a recipe dto from the inputs
     * 
     * @returns {object}
     */
    compileDto()
    {
        const title         = this.mTitleInput.value;
        const monthsOld     = this.mAgeInput.value;
        const originalRecipeLink = this.mLinkInput.value;
        const youtubeVideoLink   = this.mVideoInput.value;
        const prepareTimeInMinutes = this.mPrepTimeInput.value;
        const cookTimeInMinutes    = this.mCookTimeInput.value;
        const instructions  = this.mInstructionsInput.value;
        const storageInfo   = this.mStorageInput.value;
        const season        = this.mSeasonInput.active;

        const fingerFood    = this.mFingerfoodInput.state;
        const hasToCook     = this.mCookInput.state;
        const hasAllergens  = this.mAllergensInput.state;
        const hasEggs       = this.mEggsInput.state;
        const hasNuts       = this.mNutsInput.state;
        const hasLactose    = this.mLactoseInput.state;
        const hasGluten     = this.mGlutenInput.state;

        const mealTypes   = this.mMealTypeInput.stateList;
        const products    = this.mIngredientList.chosenProducts;
        const stepBySteps = this.mStepEditor.getStepList();

        const hasStepByStep = stepBySteps.length > 0 ? true : false;
        // ---------------------------------------------
        // - Optional fields
        // ----------------------------------------------

        const interestingInfo = this.mInfoInput.value;
        const tips            = this.mTipsInput.value;
        const nutritionValue  = this.mNutritionInput.value;

        if 
        ( 
            title.length === 0 ||
            originalRecipeLink.length === 0 ||
            prepareTimeInMinutes < 1 ||
            cookTimeInMinutes < 1 ||
            monthsOld < 1 ||
            instructions.length === 0 ||
            storageInfo.length === 0 ||
            season.length === 0 ||
            products.length === 0 ||
            mealTypes.length === 0
        )
        {
            return null;
        }

        const dataObject =
        {
            title,
            monthsOld,
            originalRecipeLink,
            youtubeVideoLink,
            prepareTimeInMinutes,
            cookTimeInMinutes,
            instructions,
            storageInfo,
            season,
            fingerFood,
            hasStepByStep,
            hasToCook,
            hasAllergens,
            hasEggs,
            hasNuts,
            hasLactose,
            hasGluten,
            mealTypes,
            stepBySteps,
            products,
            tips,
            nutritionValue,
            interestingInfo
        };

        return { title: 'recipe', data: dataObject };
    }

    /**
     * Generates the list of existing recipes
     * --------------------------------------
     * 
     * @param {array} list 
     */
    generateList(list)
    {
        console.log(`RecipeView::generateList() -- Recipe amount: ${list.length}`);

        deleteChildren(this.mRecipeList);
        this.mRecipeObjects = [];

        for (const recipe of list)
        {
            const id    = recipe.id;
            const title = recipe.title;
           
            console.log(`Generating recipe list id: ${id}, title: ${title}`);

            // - Add a product reference
            this.mRecipeObjects.push({title});

            const imgElem = newTagClass("img", "preview__img");
            
            if ( recipe.image !== null )
            {
                console.log(`Image file is present`);
                imgElem.src = `data:${recipe.image.fileType};base64,${recipe.image.data}`;
            }

            console.log(`Image element: ${imgElem}`);

            // ----------------------------------------
            // - Create editor button that opens
            // - up a recipe editor for this recipe
            // ----------------------------------------

            const 
            editButton = newTagClass("button", "preview__button--edit");
            editButton.addEventListener
            (
                "click",
                e =>
                {
                    this.mViewNode.style.display = 'none';
                    const editor = new RecipeEditor(recipe, this, this.mViewNode, this.mAvailableProducts);
                    this.mEditorNode.appendChild(editor);
                }
            );

            // ----------------------------------------
            // - Create button that DELETEs this recipe
            // ----------------------------------------

            const 
            removeButton = newTagClass("button", "preview__button--delete");
            removeButton.addEventListener
            (
                "click",
                e =>
                {
                    this.removeRecipe(id);
                }
            );

            // ----------------------------------------
            // - Finally add this row into the existing
            // - Recipes list
            // ----------------------------------------

            this.mRecipeList.appendChild
            (
                newTagClassChildren
                (
                    "div",
                    "preview__row",
                    [
                        imgElem,
                        newTagClassHTML
                        (
                            "p",
                            "preview__label",
                            `${title}, ${id}`
                        ),
                        editButton,
                        removeButton
                    ]
                )
            );
        }

        console.log(`RecipeView()Items in list ready`);
    }

   /**
    * Read recipes from cache or from server
    * --------------------------------------
    */
    loadRecipes()
    {
        this.getRecipes()
            .then
            (data => 
            {    
                console.log(`LoadRecipes(): ${data}`);
                try 
                {
                    const list = JSON.parse(data);
                    if ( list ) this.generateList(list);
                } 
                catch (error) {}
            })
            .catch(error => { console.log(`Could not read recipes: ${error}`); });
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
     * 
     * @param  {RecipetDto} dto 
     * @param  {File}       imageFile
     * @return {String}
     */
    addRecipe(dto, imageFile)
    {
        return FileCache.postDtoAndImage(RECIPE_URL, dto, imageFile);
    }

    /**
     * Builds and executes API addRecipeWithSteps route
     * 
     * @param  {RecipeDto} dto 
     * @param  {File}      imageFile
     * @param  {Array}     stepDtoList
     * @param  {Array}     stepImageList
     * @return {String}
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
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    removeRecipe(id)
    {
        console.log(`Remove product ${id} called`);
        FileCache
            .delete(RECIPE_URL, id)
            .then(response => {
                console.log(`Remove recipe response: ${response}`);

                this.loadRecipes();
            })
            .catch(error => {
                console.log(`Remove recipe exception catched: ${error}`);
            });
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        console.log("RecipeView::callback connected");

        // -------------------------------------------
        // - Add a 'product-chosen' event listener
        // -------------------------------------------

        this.shadowRoot.addEventListener('product-chosen', e => 
        {
            const productDetail = e.detail;

            if (productDetail)
            {
                console.log(`Prodcut-chosen event intercepted, ${productDetail.name}`);
                console.log(`Has allergens: ${productDetail.hasAllergens}`);

                if ( ! productDetail.hasAllergens) return;

                const hasEggs    = productDetail.hasEggs;
                const hasNuts    = productDetail.hasNuts;
                const hasLactose = productDetail.hasLactose;
                const hasGluten  = productDetail.hasGluten;
                
                if (hasEggs)    this.mEggsInput.turnOn(); 
                if (hasNuts)    this.mNutsInput.turnOn(); 
                if (hasLactose) this.mLactoseInput.turnOn(); 
                if (hasGluten)  this.mGlutenInput.turnOn(); 
                 
            }
        }, true);
    }

    disconnectedCallback()
    {
        console.log("RecipeView -- disconnected");
    }  
}

window.customElements.define('recipe-view', RecipeView);

export { RecipeView };