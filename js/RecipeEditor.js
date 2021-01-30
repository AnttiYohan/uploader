import { WCBase, props, RECIPE_URL, STEP_BY_STEP_URL } from './WCBase.js';
import { StepMenu }    from './StepMenu.js';
import { ProductMenu } from './ProductMenu.js';
import 
{ 
    newTagClass, 
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    setSelectedIndex, 
    inputClassValue, 
    numberInputClass,
    fileInputClass,
    setImageFileInputThumbnail,
    setImageThumbnail
} from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='editor'>  
  <div class='editor__frame'>

    <!-- RECIPE EDITOR HEADER -->
    <header class='header'>
        <h3 class='header__title'>Recipe Editor</h3>
    </header>

    <!-- EXIT EDITOR ROW -->

    <div class='editor__rowset'>
        <label class='editor__label'>Exit editor</label>
        <button class='editor__button--exit'></button>
    </div>

    <!-- RESET EDITOR ROW -->

    <div class='editor__rowset'>
        <label class='editor__label'>Reset values</label>
        <button class='editor__button--reset'></button>
    </div>

    <!-- RECIPE TITLE -->

    <div class='editor__gridrow'>
        <label  class='editor__label'>Edit Title</label>
        <input  class='editor__input  recipe_title' type='text'>
        <button class='editor__button recipe_title'></button>
   </div>

    <!-- RECIPE IMAGE -->

    <div class='editor__row--file'>
        <img src='assets/icon_cached.svg'   class='editor__image recipe_image' />
        <div class='editor__fileframe'>
           <label for='image-upload-input'  class='editor__filelabel'>image upload</label>
           <input  id='image-upload-input'  class='editor__file recipe_image' type='file'>
        </div>
        <button class='editor__button recipe_image'></button>
    </div>

    <!-- PREPARE TIME -->

    <div class='editor__gridrow'>
        <label class='editor__label'>Prep Time</label>
        <input class='editor__input recipe_prepare_time' type='number'>
        <button class='editor__button recipe_prepare_time'></button>
    </div>

    <!-- AGE IN MONTHS -->

    
    <div class='editor__gridrow'>
        <label class='editor__label'>Change Age</label>
        <input class='editor__input recipe_age' type='number'>
        <button class='editor__button recipe_age'></button>
    </div>

    <!-- INSTRUCTIONS -->

    <div class='editor__textareaset'>
        <div class='editor__row--instructions'>
            <label  class='editor__label'>Instructions</label>
            <button class='editor__button recipe_instructions'></button>
        </div>
        <textarea class='editor__textarea recipe_instructions' name='instructions' rows="8"></textarea>
    </div>

    <!-- MANDATORY CHECKBOXES -->

    <!-- FINGERFOOD ROW -->

    <div class='editor__inputrow'>
        <label class='editor__label--checkbox'>Fingerfood
            <input class='editor__checkbox fingerfood' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <button class='editor__button recipe_fingerfood m-0'></button>
    </div>

    <!-- HAS TO COOK -->

    <div class='editor__inputrow'>
        <label class='editor__label--checkbox'>Has To Cook
            <input class='editor__checkbox has_to_cook' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <button class='editor__button has_to_cook m-0'></button>
    </div>

    <!-- ALLERGEN LIST (as one update) -->

    <div class='editor__checkboxgroup'>

        <!-- HAS EGGS -->

        <label class='editor__label--checkbox'>Has Eggs
            <input class='editor__checkbox has_eggs' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- HAS NUTS -->

        <label class='editor__label--checkbox'>Has Nuts
            <input class='editor__checkbox has_nuts' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- HAS LACTOSE -->

        <label class='editor__label--checkbox'>Has Lactose
            <input class='editor__checkbox has_lactose' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- HAS GLUTEN -->
        
        <label class='editor__label--checkbox'>Has Gluten
            <input class='editor__checkbox has_gluten' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label> 

        <!-- UPDATE BUTTON -->
        <button class='editor__button--allergens'></button>
    </div>
    <!-- STEP LIST -->

    <div class='editor__division'>
    </div>
    <step-menu     class='step_menu'></step-menu>

    <!-- PRODUCT LIST -->

    <div class='editor__division'>
    </div>
    <product-menu class='product_menu'></product-menu>

    <div class='editor__division'>
    </div>

    <!-- SEASON -->

    <div class='editor__selectrow'>
      <label  class='editor__label'>Season</label>
      <select class='editor__select recipe_season' name='season'>
        <option value='WINTER'>winter</option>
        <option value='SPRING'>spring</option>
        <option value='SUMMER'>summer</option>
        <option value='AUTUMN'>autumn</option>
      </select>
      <button class='editor__button season'></button>
    </div>
      
    <!-- MEAL TYPES -->

    <label class='editor__label'>Meal types</label>
    <div class='editor__checkboxgroup mealtypes_group'>

        <!-- BREAKFAST -->

        <label class='editor__label--checkbox'>Breakfast
          <input class='editor__checkbox breakfast' type='checkbox'>
          <span class='editor__checkmark'></span>
        </label>

        <!-- LUNCH -->

        <label class='editor__label--checkbox'>Lunch
            <input class='editor__checkbox lunch' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- DINNER -->

        <label class='editor__label--checkbox'>Dinner
            <input class='editor__checkbox dinner' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- SNACK -->

        <label class='editor__label--checkbox'>Snack
            <input class='editor__checkbox snack' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- DESSERT -->

        <label class='editor__label--checkbox'>Dessert
          <input class='editor__checkbox dessert' type='checkbox'>
          <span class='editor__checkmark'></span>
        </label>

        <!-- APPETIZER -->

        <label class='editor__label--checkbox'>Appetizer
            <input class='editor__checkbox appetizer' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- SALAD -->

        <label class='editor__label--checkbox'>Salad
            <input class='editor__checkbox salad' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- SOUP -->

        <label class='editor__label--checkbox'>Soup
            <input class='editor__checkbox soup' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- SMOOTHIE -->

        <label class='editor__label--checkbox'>Smoothie
            <input class='editor__checkbox smoothie' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

        <!-- BEVERAGES -->

        <label class='editor__label--checkbox'>Beverages
            <input class='editor__checkbox beverages' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>

    </div> <!-- ENDOF editor checkboxgroup div -->
  </div> <!-- editor__frame -->
</div>`;

/**
 * 
 */
class RecipeEditor extends WCBase
{
    constructor(recipeDto, parent, viewNode, availableProducts)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mRecipeDto = recipeDto;
        this.mParentContext = parent;
        this.mParentView = viewNode;
        this.mAvailableProducts = availableProducts;
        this.mDisplay = 'flex';
        this.mProductObjects = [];

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
        .editor {
            display: flex;
            position: absolute;
            top: 0;
            width: 100vw;
            /*height: 80vh;*/
            margin: auto;
            background-color: #fff;
        }
        .editor__subheader {
            font-size: ${props.header_font_size};
            color: ${props.darkgrey};
        }
        .editor__division {
            height: ${props.lineHeight};
            padding: 8px 0;
            background-color: ${props.disabled};
        }
        .editor__frame {
            display: flex;
            flex-direction: column;
            margin: 16px auto;
            max-width: 600px;
            width: ${props.frame_width};
        }
        .editor__fileframe {
            position: relative;
        }
        .editor__file {
            position: absolute;
            appereance: none;
            z-index: -1;
            opacity: 0;
        }
        .editor__filelabel {
            display: inline-block;
            cursor: pointer;
            margin: 8px 0;
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
        .editor__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
        }
        .editor__label--fullwidth {
            width: 100%;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
        }
        .editor__paragraph {
            color: #222;
            font-weight: 200;
            font-size: ${props.text_font_size};
        }
        .editor__image {
            width: ${props.thumbnail_side};
            height: ${props.thumbnail_side};
            border-radius: 4px;
            box-shadow: 0 1px 15px 0px rgba(0,0,0,0.25);
        }
        .editor__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__selectrow {
            display: grid;
            grid-template-columns: 128px auto 64px;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__refreshrow {
            display: flex;
            justify-content: space-between;
            padding: ${props.uploader_row_pad};
            height: ${props.uploader_row_height};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__gridrow {
            display: grid;
            grid-template-columns: auto auto 48px;
            /*grid-template-columns: auto ${props.input_width} 48px;*/
            height: ${props.uploader_row_height};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__row--instructions {
            display: grid;
            grid-template-columns: auto 48px;
            height: ${props.uploader_row_height};
            padding: 8px 0 8px 0;
        }
        .editor__row--file {
            display: grid;
            grid-template-columns: auto ${props.input_width} 48px;
            height: ${props.uploader_row_height};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__inputrow {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: 8px 8px 8px 0;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__inputrow .editor__label {
            width: 128px;
            height: 32px;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;          
        }
        .editor__textareaset {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__textarea {
            margin-bottom: ${props.lineHeight};
            height: 100px;
            padding: 8px;
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            border: 1px solid ${props.lightgrey};
        }
        .editor__checkboxgroup {
            border: 1px solid ${props.lightgrey};
            margin-left: ${props.checkmark_width};
        }
        .editor__label--checkbox {
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
        .editor__label--checkbox .editor__checkbox {
            cursor: pointer;
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        .editor__checkmark {
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 8px;
            border: 2px solid ${props.darkgrey};
            height: ${props.checkmark_height};
            width: ${props.checkmark_width};
            background-color: ${props.disabled};
            background-image: url('assets/icon_circle');
            background-origin: content-box;
            background-repeat: no-repeat;
            background-position-x: left;
            transition: background-position .15s ease-in-out, background-color .5s ease-in-out;
        }
        .editor__label--checkbox:hover ~ .editor__checkmark {
            background-color: ${props.lightgrey};
        }
        .editor__label--checkbox .editor__checkbox:checked ~ .editor__checkmark {
            background-color: ${props.red};
            background-position-x: right;
        }
        /* Checkmark indicator when not checked */
        .editor__checkmark:after {
            content: '';
            position: absolute;
            display: none;
        }
        /* Checkmark indicator display on check*/
        .editor__label--checkbox .editor__checkbox:checked ~ .editor__checkmark:after {
            display: block;
        }
        /* Style the checkmark */
        .editor__label--checkbox .editor__checkmark:after {
            background-position-x: right;
        }
        .editor__input {
            width: ${props.input_width};
            padding: ${props.inner_pad};
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            background-color: transparent;
            outline: none;
            border: none;
            border-bottom: 1px solid ${props.grey};
        }
        .editor__button {
            cursor: pointer;
            margin: 0 auto;
            align-self: center;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.green};
            background-image: url('assets/icon_update.svg');
        }
        .editor__button--new {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_add_circle.svg');
        }
        .editor__button--save {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_save.svg');
        }
        .editor__button--exit {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/ic_left.svg');
        }
        .editor__button--reset {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_undo.svg');
        }
        .editor__button--allergens {
            cursor: pointer;
            margin: 0 8px 8px 0;
            float: right;
            transform: translateY(-106px);
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_update.svg');
        }
        .editor__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        .step__frame {
            display: flex;
            flex-direction: column;
        }
        .step__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .step__box {
            border: 4px solid #fff;
            background-color: ${props.lightgrey};
            text-align: center;
            font-size: ${props.small_font_size};
            font-weight: 200;
            color: #222;
            width: 32px;
            height: 32px;
        }
        .step__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: ${props.lineHeight};
        }
        .step__input {
            font-size: ${props.small_font_size};
            font-weight: 300;
            color: #222;
            outline: none;
            background: transparent;
            border-bottom: 2px solid ${props.darkgrey};
        }
        .step__button--delete
        {
            margin-left: 4px;
            margin-top: 2px;
            width: 16px;
            height: 16px;
            background-image: url('assets/icon_cancel');
            background-repeat: no-repeat;
        }
        .editor__image {
            width: 32px;
            height: 32px;
            align-self: center;
        }
        .header {
            display: flex;
            height: 64px;
            justify-content: center;
            border-bottom: 1px solid ${props.lightgrey};
            box-shadow: 0 0 14px 2px rgba(0,0,0,0.25);
        }
        .header__title {
            font-size: ${props.header_font_size};
            font-weight: 500;
            align-self: center;
        }
        .m-0 {
            margin: 0;
        }
        `);

        // ----------------------------------------------------------
        // - Listen for child component connected events
        // ----------------------------------------------------------

        window.addEventListener
        ("productmenuconnected", e => 
        {
            this.handleProductMenuEvent(e);
        }, 
        true);

        window.addEventListener
        ("stepmenuconnected", e => 
        {
            this.handleStepMenuEvent(e);
        }, 
        true);

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.mIsStepEditorOpen = false;

        // ------------------------------------------------------------
        // - Save element references
        // ------------------------------------------------------------

        this.mRootElement = this.shadowRoot.querySelector('.editor');
        this.mResetButton = this.shadowRoot.querySelector('.editor__button--reset');
        this.mRecipeImage = this.shadowRoot.querySelector('.editor__image.recipe_image');
        this.mStepMenu    = this.shadowRoot.querySelector('.step_menu');
        this.mProductMenu = this.shadowRoot.querySelector('.product_menu');

        this.mExitButton = this.shadowRoot.querySelector('.editor__button--exit');
        this.mExitButton.addEventListener
        ("click", e => 
        { 
            this.mParentView.style.display = 'flex';
            this.remove();
            delete this;
        });

        // -----------------------------------------------------------------------------------
        // - Recipe Title update input/button
        // -----------------------------------------------------------------------------------

        this.mTitleInput        = this.shadowRoot.querySelector('.editor__input.recipe_title');
        const titleButton       = this.shadowRoot.querySelector('.editor__button.recipe_title');
        titleButton.addEventListener
        ('click', e => 
        {  
            if (this.mTitleInput.value.length)
            {
                this.updateTitleById(this.mTitleInput.value)
                    .then(data => {

                        console.log(`RecipeEditor::updateTitle response: ${data}`);
                        //FileCache.clearCache(RECIPE_URL);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updateTitle request error: ${error}`);

                    });
            }
        });

        // -----------------------------------------------------------------------------------
        // - Recipe Image update input/button
        // -----------------------------------------------------------------------------------

        //this.mImageInput        = this.shadowRoot.querySelector('.editor__input.recipe_image');
        const imageInput        = this.shadowRoot.querySelector('.editor__file.recipe_image');
        const imageButton       = this.shadowRoot.querySelector('.editor__button.recipe_image');
        imageButton.addEventListener
        ('click', e => 
        {
            if ('files' in imageInput && imageInput.files.length)
            {
                const file = imageInput.files[0];

                this.updateImage(file)
                    .then(data => {

                        console.log(`RecipeEditor::updateImage response: ${data}`);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updateImage fail: ${error}`);

                    });

            }
        });

        // -----------------------------------------------------------------------------------
        // - Recipe prepare time update input/button
        // -----------------------------------------------------------------------------------

        this.mPrepareTimeInput       = this.shadowRoot.querySelector('.editor__input.recipe_prepare_time');
        const prepareTimeButton      = this.shadowRoot.querySelector('.editor__button.recipe_prepare_time');
        prepareTimeButton.addEventListener
        ('click', e => 
        {
            if (this.mPrepareTimeInput.value > 0)
            {
                this.updatePrepareTime(this.mPrepareTitmeInput.value)
                    .then(data => {

                        console.log(`RecipeEditor::updatePrepareTime response: ${data}`);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updatePrepareTime fail: ${error}`);

                    });

            }
        });

        // -----------------------------------------------------------------------------------
        // - Recipe age in months update input/button
        // -----------------------------------------------------------------------------------

        this.mAgeInput      = this.shadowRoot.querySelector('.editor__input.recipe_age');
        const ageButton     = this.shadowRoot.querySelector('.editor__button.recipe_age');
        ageButton.addEventListener
        ('click', e => 
        {
            if (this.mAgeInput.value > 0)
            {
                this.updateAge(this.mAgeInput.value)
                    .then(data => {

                        console.log(`RecipeEditor::updateAge response: ${data}`);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updateAgefail: ${error}`);

                    });

            }
        });


        // -----------------------------------------------------------------------------------
        // - Recipe instructions update input/button
        // -----------------------------------------------------------------------------------

        this.mInstructionsInput      = this.shadowRoot.querySelector('.editor__textarea.recipe_instructions');
        const instructionsButton     = this.shadowRoot.querySelector('.editor__button.recipe_instructions');
        instructionsButton.addEventListener
        ('click', e => 
        {
            if (this.mInstructionsInput.value.length)
            {
                this.updateInstructions(this.mInstructionsInput.value)
                    .then(data => {

                        console.log(`RecipeEditor::updateInstrictions response: ${data}`);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updateInstructions fail: ${error}`);

                    });

            }
        });

        // -----------------------------------------------------------------------------------
        // - Recipe fingerfood update input/button
        // -----------------------------------------------------------------------------------

        this.mFingerFoodInput     = this.shadowRoot.querySelector('.editor__checkbox.fingerfood');
        const fingerFoodButton    = this.shadowRoot.querySelector('.editor__button.recipe_fingerfood');
        fingerFoodButton.addEventListener
        ('click', e => 
        {
            //if (this.mFingerfoodInput.checked)
            //{
                this.updateFingerFood(this.mFingerFoodInput.checked)
                    .then(data => {

                        console.log(`RecipeEditor::updateFingerFood response: ${data}`);
                        this.mParentView.style.display = 'flex';
                        this.mParentContext.loadRecipes();
                        this.remove();

                    })
                    .catch(error => {

                        console.log(`RecipeEditor::updateFingerFood fail: ${error}`);

                    });

           // }
        });

        // ----------------------------
        // - Mealtypes checkboxes
        // ----------------------------

        // - Checkboxe
        this.mHasToCookInput    = this.shadowRoot.querySelector('.editor__checkbox.has_to_cook');
        this.mHasEggsInput      = this.shadowRoot.querySelector('.editor__checkbox.has_eggs');
        this.mHasNutsInput      = this.shadowRoot.querySelector('.editor__checkbox.has_nuts');
        this.mHasLactoseInput   = this.shadowRoot.querySelector('.editor__checkbox.has_lactose');
        this.mHasGlutenInput    = this.shadowRoot.querySelector('.editor__checkbox.has_gluten');

        this.mSeasonInput       = this.shadowRoot.querySelector('.editor__select.recipe_season');
     
        // - Mealtype checkboxes

        this.mMealtypeMap =
        {
            "BREAKFAST": this.shadowRoot.querySelector('.editor__checkbox.breakfast'),
            "LUNCH":     this.shadowRoot.querySelector('.editor__checkbox.lunch'),
            "DINNER":    this.shadowRoot.querySelector('.editor__checkbox.dinner'),
            "SNACK":     this.shadowRoot.querySelector('.editor__checkbox.snack'),
            "DESSERT":   this.shadowRoot.querySelector('.editor__checkbox.dessert'),
            "APPETIZER": this.shadowRoot.querySelector('.editor__checkbox.appetizer'),
            "SALAD":     this.shadowRoot.querySelector('.editor__checkbox.salad'),
            "SOUP":      this.shadowRoot.querySelector('.editor__checkbox.soup'),
            "SMOOTHIE":  this.shadowRoot.querySelector('.editor__checkbox.smoothie'),
            "BEVERAGES": this.shadowRoot.querySelector('.editor__checkbox.beverages')
        };

        this.mStorageInfoInput  = this.shadowRoot.querySelector('.editor__input.recipe_storage');
        this.mTipsInput         = this.shadowRoot.querySelector('.editor__input.recipe_tips');
        this.mNutritionInput    = this.shadowRoot.querySelector('.editor__input.recipe_nutritional_value');
        this.mInterestingInfo   = this.shadowRoot.querySelector('.editor__input.recipe_interesting_info');

        //this.initTest(recipeDto);
        //this.initEditor(recipeDto);
    }

    initTest(dto)
    {
        for (let key in dto)
        {
            console.log(`Set: ${key}: ${dto[key]}`);
        }
    }

    initEditor(recipeDto)
    {
        this.mRecipeDto = recipeDto;

        this.mTitleInput.value = recipeDto.title;
        this.mRecipeImage.src = `data:${recipeDto.image.fileType};base64,${recipeDto.image.data}`;
        this.mPrepareTimeInput.value = recipeDto.prepareTimeInMinutes;
        this.mAgeInput.value = recipeDto.monthsOld;
        setSelectedIndex(this.mSeasonInput, recipeDto.season);
        
        // ----------------------
        // - Parse meal types
        // ----------------------

        for (const mt of recipeDto.mealTypes)
        {
            console.log(`Mealtype: ${mt} - ${mt.name}`);
            const keys = Object.keys(mt);
            const key = keys[0];
            console.log(`Mealtype ${key} : ${mt['name']}`);

            if ( mt.name && mt.name in this.mMealtypeMap)
            {
                this.mMealtypeMap[mt.name].checked = true;
            }
        
        }

        // -----------------------------
        // - Parse mandatory checkboxes
        // -----------------------------

        this.mFingerfoodInput = recipeDto.fingerFood;
        this.mHasToCookInput  = recipeDto.hasToCook;
        this.mHasEggsInput    = recipeDto.hasEggs;
        this.mHasNutsInput    = recipeDto.hasNuts;
        this.mHasLactoseInput = recipeDto.hasLactose;
        this.mHasGlutenInput  = recipeDto.hasGluten;
        this.mStorageInfoInput = recipeDto.storageInfo;
        this.mTipsInput        = recipeDto.tips;
        this.mNutritionInput   = recipeDto.nutritionValue;
        this.mInterestingInfo  = recipeDto.interestingInfo;

        //this.initProducts(recipeDto.products);
        
        console.log(`ProductMenu: ${this.mProductMenu}`);

        this.mProductMenu.setupProductList(recipeDto.products);
        this.mProductMenu.setupAvailableProducts(this.mAvailableProducts);

    }

    /**
     * -------------------------
     * Opens the New Step Editor
     * -------------------------
     */
    openStepEditor()
    {
        this.mIsStepEditorOpen = true;

        // -----------------------------
        // - Text row
        // -----------------------------

        const textInput = inputClassValue("step__input", "text");

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "step__rowset",
                [
                    newTagClassHTML("p", "step__label", "Text"),
                    textInput
                ]
            )
        );

        // -----------------------------
        // - Step number row
        // -----------------------------

        const stepNumberInput = numberInputClass("step__input");

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "step__rowset",
                [
                    newTagClassHTML("p", "step__label", "Step number"),
                    stepNumberInput
                ]
            )
        );

        // -----------------------------
        // - Image row
        // -----------------------------

        const imageElement = newTagClass("img", "step__box");
        const imageFileInput = fileInputClass("step__input");

        setImageFileInputThumbnail(imageFileInput, imageElement);
                
        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "step__rowset",
                [
                    imageElement,
                    imageFileInput
                ]
            )
        );

        // -----------------------------
        // - Add step row
        // -----------------------------

        const 
        addStepButton = newTagClass("button", "editor__button--save");
        addStepButton.addEventListener
        (
            "click",
            e => 
            {
                // -----------------------------
                // - Validate inputs
                // -----------------------------
                let file = null;

                if ('files' in imageFileInput && imageFileInput.files.length)
                {
                    file = imageFileInput.files[0];
                }

                if 
                ( 
                    textInput.value.length &&
                    stepNumberInput.value,
                    file
                )
                {
                    this.addStep
                    (
                        {
                            stepNumber: stepNumberInput.value,
                            text: textInput.value,
                            image: file
                        }
                    );
                }
            }
        );

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "step__rowset",
                [
                    newTagClassHTML("p", "step__label", "Add step"),
                    addStepButton
                ]
            )
        );

    }

    /**
     * Uploads the step and closes the editor
     * @param {*} step 
     */
    addStep(step)
    {
        console.log(`Add step: ${step.stepNumber}, ${step.text}`);

        this.generateStepList([step]);
        deleteChildren(this.mStepEditor);
        this.mIsStepEditorOpen = false;
    }

    generateStepList(list)
    {
        //deleteChildren(this.mStepList);

        for (const step of list)
        {
            const 
            deleteButton = newTagClass("div", "step__button--delete");
            deleteButton.addEventListener
            (
                "click",
                e =>
                {
                    console.log(`Delete ${step.text}`);
                }
            );

            const 
            imageElement = newTagClass("img", "step__box");
            imageElement.src = step.image;

            this.mStepList.appendChild
            (
                newTagClassChildren
                (
                    "div",
                    "step__rowset",
                    [
                        deleteButton,
                        imageElement,
                        newTagClassHTML("p", "step__label", `${step.stepNumber}: ${step.text}`)
                    ]
                )
            );
        }
    }

    initProducts(products)
    {
        console.log(`RecipeEditor::initProducts, amt: ${products.length}`);

        deleteChildren(this.mProductList);

        for (const product of products)
        {
            console.log(`Product: ${product.name}`);

            // -----------------------------------
            // - Append a product item
            // -----------------------------------

            this.mProductList.appendChild
            (

            )

        }
    }

    // ----------------------------------------------
    // - Update method section -
    // --------------------------
    // - Field 'title' update
    // ----------------------------------------------

    updateTitleById(newTitle)
    {
        return FileCache.patchStringById
        (
            RECIPE_URL, 
            'title', 
            newTitle, 
            'recipeId', 
            this.mRecipeDto.id
        );
    }

    updateImage(file)
    {
        return FileCache.putImageById
        (
            RECIPE_URL,
            'recipeId',
            this.mRecipeDto.id,
            'image',
            file
        );
    }

    updatePrepareTime(newTime)
    {
        return FileCache.patchNumberById
        (
            RECIPE_URL,
            'prepare-time',
            newTime,
            'recipeId',
            this.mRecipeDto.id
        );
    }

    updateAge(newAge)
    {
        return FileCache.patchNumberById
        (
            RECIPE_URL,
            'age',
            newAge,
            'recipeId',
            this.mRecipeDto.id
        );
    }

    updateInstructions(newInstructions)
    {
        return FileCache.putFieldStringById
        (
            RECIPE_URL, 
            'instructions', 
            newInstrucions, 
            'recipeId', 
            this.mRecipeDto.id
        );
    }

    updateFingerFood(newFingerFood)
    {
        return FileCache.patchBooleanById
        (
            RECIPE_URL, 
            'fingerfood', 
            newFingerFood, 
            'recipeId', 
            this.mRecipeDto.id
        );
    }


    addStepByStep(stepByStepDto, file)
    {

    }

    addProduct(productDto)
    {

    }

    // ----------------------------------------------------------------
    // - Lifacycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        console.log("RecipeEditor::callback connected");

    }

    disconnectedCallback()
    {
        console.log("RecipeView::callback connected");
    }  

    handleProductMenuEvent(event)
    {
        console.log(`onproductmenu event catched, handing by initiating the editor`);
        this.initEditor(this.mRecipeDto);
    }

    handleStepMenuEvent(event)
    {
        console.log(`onproductmenu event catched, handing by initiating the editor`);
        this.mStepMenu.setRecipeId(this.mRecipeDto.id);

        if (this.mRecipeDto.stepBySteps)
        {
            console.log(`handleStepMenuEvent: steps: ${this.mRecipeDto.stepBySteps}`);
            console.log(`step amount: ${this.mRecipeDto.stepBySteps.length}`);
            this.mStepMenu.generateList(this.mRecipeDto.stepBySteps);
        }
    }
}

window.customElements.define('recipe-editor', RecipeEditor);

export { RecipeEditor };