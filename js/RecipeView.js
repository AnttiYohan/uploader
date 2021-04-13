import { WCBase, props, RECIPE_URL, PRODUCT_URL, MEALTYPES_ENUM, MEASURE_UNIT_ENUM } from './WCBase.js';
import { RecipeEditor } from './RecipeEditor.js';
import { StepEditor } from './StepEditor.js';
import { ProductList } from './ProductList.js';
import { TextInputRow } from './TextInputRow.js';
import { TextInputArea } from './TextInputArea.js';
import { ImageInputRow } from './ImageInputRow.js';
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
 <div>
  <!-- The editor is connected here when utilized -->

  <div class='uploader__frame editor_node'>
  </div>
  <!--header>
    <h3 class='uploader__header'>Recipes</h3>
  </header-->

  <!-- Wrapper for the whole recipe view, display set to none while in editor -->
  <div class='uploader view_node'>

  <!-- New Recipe Frame -->
  <div class='uploader__frame'>

    <!-- REFRESH ROW -->

    <div class='uploader__refreshrow'>
        <p class='uploader__paragraph'>Refresh Products</p>
        <button class='uploader__button--refresh force_reload'></button>
    </div>

    <!-- RECIPE TITLE ROW -->

    <text-input-row class='title_input' required>Title</text-input-row

    <!-- RECIPE IMAGE INPUT ROW -->

    <image-input-row class='image_input'>Cover Image</image-input-row>

    <!-- RECIPE LINK -->
 
    <text-input-row class='link_input' required>Recipe Link</text-input-row>

    <!-- YOUTUBE LINK -->
 
    <text-input-row class='youtube_input'>Video Link</text-input-row>


    <!-- AGE IN MONTHS -->

    <number-input-row class='age_input' required>Age in months</number-input-row>

    <!-- PREPARATION TIME -->

    <number-input-row class='prep_time_input' required>Preparation time</number-input-row>

    <!-- COOKING TIME TIME -->

    <number-input-row class='cook_time_input' required>Cook time</number-input-row>

    <!-- RECIPE INSTRUCTIONS -->

    <text-input-area class='instructions_input' required>Instructions</text-input-area>
    
    <!-- STORAGE INFO -->
    
    <text-input-area class='storage_input' required>Storage</text-input-area>

    <!-- RECIPE SEASON DROPDOWN -->

    <radio-switch-group class='season_input' group='[
        { "title": "Winter", "value": "WINTER" }, 
        { "title": "Spring", "value": "SPRING" },
        { "title": "Summer", "value": "SUMMER" },
        { "title": "Autumn", "value": "AUTUMN" },
        { "title": "All", "value": "ALL" }
    ]'>Season</radio-switch-group>


    <!-- label  class='uploader__label'>Season</label>
    <div class='flex__row'>
        <binary-switch class='winter_season'>Winter</binary-switch>
        <binary-switch class='spring_season'>Spring</binary-switch>
        <binary-switch class='summer_season'>Summer</binary-switch>
        <binary-switch class='autumn_season'>Autumn</binary-switch>
        <binary-switch class='all_season'>All</binary-switch>
    </div -->

    <binary-button-row class='fingerfood_input'>Fingerfood</binary-button-row>
    <binary-button-row class='has_to_cook_input'>Has To Cook</binary-button-row>
    <binary-button-row class='allergens_input'>Allergens</binary-button-row>
    <binary-button-row class='eggs_input'>Has Eggs</binary-button-row>
    <binary-button-row class='nuts_input'>Has Nuts</binary-button-row>
    <binary-button-row class='lactose_input'>Has Lactose</binary-button-row>
    <binary-button-row class='gluten_input'>Has Gluten</binary-button-row>       

    <!-- RECIPE MEALTYPES MULTISELECTION -->

    <binary-switch-group class='meal_types_input'>Meal Types</binary-switch-group>

    <!-- STEP EDITOR -->
    
    <step-editor class='step_editor'></step-editor>

    <!-- INGREDIENT INPUT -->

    <product-list class='ingredient_list'></product-list>

    <!-- NON MANDATORY INPUT SET -->

    <!-- TIPS -->

    <text-input-row class='tips_input'>Tips</text-input-row>

    <!-- NUTRITIONAL VALUE -->

    <number-input-row class='nutrition_input'>Nutrition kcal</number-input-row>

    <!-- INTERESTING INFO -->

    <text-input-row class='info_input'>Interesting Info</text-input-row>

    <!-- SAVE BUTTON -->

    <div class='uploader__row--last'>
    </div>

    <button class='button--save save_recipe'>Save</button>
    
  </div>


  <!-- Existing recipe list wrapper -->

  <div class='uploader__frame'>
    <div class='uploader__frame recipe_list'>
    </div>
  </div>

  </div> <!-- End of recipe view wrapper -->

</div>`;

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
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .clickable {
            cursor: pointer;
        }
        .zoomable {
            transition: transform .15s ease-in-out;
        }
        .zoomable:hover {
            transform: scale3D(1.1, 1.1, 1.1);
        }
        .uploader {
            display: ${this.mDisplay};
            margin: 0 auto;
            max-width: 1400px;
            height: fit-content;
            background-image: url('assets/background-mesh.png');
            background-repeat: repeat;
        }
        .uploader__header {
            font-size: ${props.header_font_size};
            color: ${props.darkgrey};
        }
        .uploader__frame {
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            max-width: 600px;
        }
        .flex__row {
            display: flex;
            flex-wrap: wrap:
        }
        .uploader__row {
            display: flex;
            flex-direction: row;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__row--last {
            display: flex;
            flex-flow: row-reverse;
            padding: 16px;
            margin: 0 8px;
            border-bottom: 2px solid ${props.lightgrey};
        }
        .uploader__frame--scroll {
            display: flex;
            flex-direction: column;
            border-radius: 2px;
            border: 1px solid ${props.lightgrey};
            margin: 16px auto;
            max-width: 600px;
            width: ${props.frame_width};
            overflow-x: hidden;
            overflow-y: scroll;
            height: 75vh;
        }
        .uploader__refreshrow {
            display: flex;
            justify-content: space-between;
            padding: ${props.uploader_row_pad};
            height: ${props.uploader_row_height};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__gridrow {
            display: grid;
            grid-template-columns: 128px auto 64px;
            height: 48px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__inputrow {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__inputrow .uploader__label {
            width: 128px;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;          
        }
        .uploader__inputrow--file {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__fileframe {
            position: relative;
        }
        .uploader__file {
            position: absolute;
            appereance: none;
            z-index: -1;
            opacity: 0;
        }
        .uploader__filelabel {
            display: inline-block;
            cursor: pointer;
            border-radius: 4px;
            background-color: ${props.green};
            background-image: url( 'assets/icon_publish.svg' );
            background-repeat: no-repeat;
            background-position-x: right;
            padding: 5px 0 0 0;
            border: 2px solid rgba(0, 0, 0, 0.33);
            width: 153px;
            height: 32px;
            color: #fff;
            font-size: ${props.header_font_size};
            font-weight: 500;
            text-align: center;
            text-shadow: 0 0 2px #000;
            box-shadow: 0 1px 7px 1px rgba(0,0,0,0.25);
        }
        .uploader__paragraph {
            color: #222;
            font-weight: 200;
            font-size: ${props.text_font_size};
            align-self: center;
        }
        .uploader__image {
            width: ${props.thumbnail_side};
            height: ${props.thumbnail_side};
            border-radius: 4px;
            box-shadow: 0 1px 15px 0px rgba(0,0,0,0.25);
        }
        .uploader__input,
        .uploader__select {
            height: ${props.lineHeight};
            margin-bottom: 12px;
            padding: ${props.inner_pad};
            background-color: ${props.lightgrey};
            border: none;
            border-bottom: 1px solid ${props.darkgrey};
            outline: none;
        }
        .uploader__reciperow {
            display: grid;
            grid-template-columns: ${props.list_image_space} auto 48px 48px;
            height: ${props.list_row_height};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .uploader__list
        {
            margin-top: 24px;
            margin-bottom: 24px;
            background-color: ${props.lightgrey};
            border-left: 1px solid ${props.grey};
        }
        .ingredient__frame
        {
            display: flex;
            flex-direction: column;
            padding: 4px 0;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            border-bottom: 1px solid ${props.green};
        }
        .ingredient__row
        {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 32px;
        }
        .ingredient__title
        {
            flex-basis: 88px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: ${props.ingredient_height};
        }
        .ingredient__amount
        {
            background: transparent;
            outline: none;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 2px solid ${props.darkgrey};
            width: 32px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            margin-left: 8px;
            height: ${props.ingredient_height};
        }
        .ingredient__unit
        {
            background: transparent;
            outline: none;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 2px solid ${props.darkgrey};
            width: 96px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: ${props.ingredient_height};
        }
        .ingredient__category
        {
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            min-height: 32px;
            padding: 8px 0;
        } 
        .ingredient__button--remove
        {
            margin-left: 4px;
            margin-top: 2px;
            width: 16px;
            height: 16px;
            background-image: url('assets/icon_cancel');
            background-repeat: no-repeat;
        }
        .uploader__label {
            height: ${props.row_input_height};
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            padding: 4px 8px;
        },
        .uploader__label--text,
        .uploader__label--file,
        .uploader__label--select {
            display: block;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
        }
        .uploader__label--checkbox {
            cursor: pointer;
            display: block;
            position: relative;
            padding-left: ${props.checkmark_label_left};
            margin-bottom: 12px;
            font-size: ${props.text_font_size};
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none:
        }
        .uploader__label--checkbox .uploader__checkbox {
            cursor: pointer;
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        .uploader__checkmark {
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 8px;
            border: 2px solid ${props.darkgrey};
            height: ${props.checkmark_height};
            width: ${props.checkmark_width};
            background-color: ${props.disabled};
            background-image: url('assets/icon_cancel');
            background-origin: content-box;
            background-repeat: no-repeat;
            background-position-x: left;
            transition: background-position .15s ease-in-out, background-color .5s ease-in-out;
        }
        .uploader__label--checkbox:hover ~ .uploader__checkmark {
            background-color: ${props.lightgrey};
        }
        .uploader__label--checkbox .uploader__checkbox:checked ~ .uploader__checkmark {
            background-color: ${props.red};
            background-position-x: right;
        }
        /* Checkmark indicator when not checked */
        .uploader__checkmark::after {
            content: '';
            position: absolute;
            display: none;
        }
        /* Checkmark indicator display on check*/
        .uploader__label--checkbox .uploader__checkbox:checked ~ .uploader__checkmark::after {
            display: block;
        }
        /* Style the checkmark */
        .uploader__label--checkbox .uploader__checkmark::after {
            background-position-x: right;
        }
        .uploader__checkboxgroup {
            margin-top: 24px;
            border: 1px solid ${props.lightgrey};
            margin-left: ${props.checkmark_width};
        }
        .uploader__input {
            height: ${props.lineHeight};
            margin-bottom: 12px;           
        }
        .uploader__select {
            height: ${props.lineHeight};
            margin-bottom: 12px;
            width: ${props.input_width};
        }
        .uploader__textarea {
            margin-bottom: ${props.lineHeight};
            height: 100px;
            padding: 8px;
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            border: 1px solid ${props.lightgrey};
        }
        .uploader__iconframe {
            display: flex;
        }
        .uploader__button {
            cursor: pointer;
            border-radius: 4px;
            margin-top: 16px;
            font-size: ${props.header_font_size};
            font-weight: 300;
            height: ${props.lineHeight};
            color: #fff;
            background-color: ${props.red};
            background-repeat: no-repeat;
            background-origin: center;
        }
        .uploader__button--save {
            cursor: pointer;
            width: 64px;
            height: 64px;
            border-radius: 6px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_save.svg');
            background-repeat: no-repeat;
            background-origin: center;
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
        this.mRefreshButton  = this.shadowRoot.querySelector('.uploader__button--refresh.force_reload');
        this.mRecipeList     = this.shadowRoot.querySelector('.uploader__frame.recipe_list');
        this.mStepEditor     = this.shadowRoot.querySelector('.step_editor');
        this.mIngredientList = this.shadowRoot.querySelector('.ingredient_list');

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

        // -------------------------------------------------------------------------------------
        // - Mealtype is a multiselect -- recipe may have 1..N mealtypes
        // -------------------------------------------------------------------------------------

     
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

        this.mRefreshButton.addEventListener
        ("click", e => 
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
                this.mIngredientList.loadWords(list);
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

            const imgElem = newTagClass("img", "list__thumbnail");
            
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
            editButton = newTagClass("button", "uploader__button--edit mg-vt-left-16");
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
            removeButton = newTagClass("button", "uploader__button--delete");
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
                    "uploader__reciperow",
                    [
                        imgElem,
                        newTagClassHTML
                        (
                            "p",
                            "list__paragraph",
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
    // ---------------------------------------------
    // - HTTP Request methods
    // - --------------------
    // - (1) getRecipes
    // - (2) addRecipe
    // - (3) addStepByStep
    // - (4) updateStepByStep
    // - (5) removeStepByStep
    // ----------------------------------------------
    

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
        
    }

    disconnectedCallback()
    {
        console.log("RecipeView -- disconnected");
    }  
}

window.customElements.define('recipe-view', RecipeView);

export { RecipeView };