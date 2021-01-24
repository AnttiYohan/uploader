import { WCBase, props, RECIPE_URL, STEP_BY_STEP_URL } from './WCBase.js';
import 
{ 
    newTagClass, 
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    setSelectedIndex, 
    inputClassValue, 
    numberInputClass,
    fileInputClass 
} from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='editor'>
  <!--header>
    <h3 class='editor__header'>Recipe editor</h3>
  </header-->
  <div class='recipe__frame'>

    <!-- basic info -->
    <!-- Recipe title updatable row set -->
    <label  class='editor__label'>Edit Title</label>
    <div    class='editor__rowset'>
      <input  class='editor__input  recipe_title' type='text'>
      <button class='editor__button recipe_title'></button>
    </div>

    <!-- Recipe image updatable row set -->

    <label  class='editor__label'>Change Image</label>
    <div    class='editor__rowset'>
      <img  class='editor__image recipe_image'></img>
      <input class='editor__input recipe_image' type='file'>
      <button class='editor__button recipe_image'></button>
    </div>

    <!-- Recipe prepare time updatable row set -->

    <label class='editor__label'>Change prepare time</label>
    <div   class='editor__rowset'>
      <input class='editor__input recipe_prepare_time' type='number'>
      <button class='editor__button recipe_prepare_time'></button>
    </div>

    <!-- Recipe age in months updatable row set -->

    <label class='editor__label'>Change age in months</label>
    <div   class='editor__rowset'>
      <input class='editor__input recipe_age' type='number'>
      <button class='editor__button recipe_age'></button>
    </div>

    <!-- Step by step list -->

    <div class='editor__division'>
    </div>
    <div class='editor__rowset'>
      <h3  class='editor__subheader'>Steps</h3>
      <button class='editor__button--new new_recipe_step'></button>
    </div>
    <div class='step__editor'>
    </div>
    <div class='step__frame'>
    </div>

    <!-- Ingredient Product list -->

    <div class='editor__division'></div>
    <h3  class='editor__subheader'>Steps</h3>
    <div class='product__frame'>
    </div>

    <!-- Season Selection -->

    <label  class='editor__label'>Season</label>
    <select class='editor__select recipe_season' name='season'>
      <option value='WINTER'>winter</option>
      <option value='SPRING'>spring</option>
      <option value='SUMMER'>summer</option>
      <option value='AUTUMN'>autumn</option>
    </select>

    <label class='editor__label'>Meal types</label>

    <div class='editor__checkboxgroup mealtypes_group'>

        <label class='editor__label--checkbox'>Breakfast
          <input class='editor__checkbox breakfast' type='checkbox'>
          <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Lunch
            <input class='editor__checkbox lunch' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Dinner
            <input class='editor__checkbox dinner' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Snack
            <input class='editor__checkbox snack' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Dessert
          <input class='editor__checkbox dessert' type='checkbox'>
          <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Appetizer
            <input class='editor__checkbox appetizer' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Salad
            <input class='editor__checkbox salad' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Soup
            <input class='editor__checkbox soup' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Smoothie
            <input class='editor__checkbox smoothie' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
        <label class='editor__label--checkbox'>Beverages
            <input class='editor__checkbox beverages' type='checkbox'>
            <span class='editor__checkmark'></span>
        </label>
    </div>
  </div> <!-- editor__frame -->
</div>`;

/**
 * 
 */
class RecipeEditor extends WCBase
{
    constructor(recipeDto, image)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mRecipeDto = recipeDto;
        this.mImage     = image;

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
            width: 80vw;
            height: 80vh;
            margin: auto;
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
        }
        .editor__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: ${props.lineHeight};
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
            padding: 4px;
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            background-color: transparent;
            outline: none;
            border-bottom: 2px solid ${props.grey};
            height: ${props.lineHeight};
        }
        .editor__button {
            cursor: pointer;
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
            height
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
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.mIsStepEditorOpen = false;

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.editor');
        this.mResetButton = this.shadowRoot.querySelector('.editor__button--reset');
        this.mRecipeImage = this.shadowRoot.querySelector('.editor__image.recipe_image');
        this.mStepEditor  = this.shadowRoot.querySelector('.step__editor');
        this.mStepList    = this.shadowRoot.querySelector('.step__frame');
        this.mProductList = this.shadowRoot.querySelector('.product__frame');

        this.mNewStepButton = this.shadowRoot.querySelector('.editor__button--new.new_recipe_step');
        this.mNewStepButton.addEventListener
        (
            "click",
            e =>
            {
                if ( ! this.mIsStepEditorOpen )
                {
                    this.openStepEditor();
                }
            }
        );
        
        // ---------------------------
        // - Input references
        // ---------------------------

        /*
        const dataObject =
        {
            title,
            instructions,
            prepareTimeInMinutes,
            monthsOld,
            season,
            mealTypes,
            interestingInfo,
            tips,
            storageInfo,
            fingerFood,
            hasStepByStep,
            products,
            nutritionValue,
            hasToCook,
            hasAllergens,
            hasEggs,
            hasNuts,
            hasLactose,
            hasGluten
        };*/


        this.mTitleInput        = this.shadowRoot.querySelector('.editor__input.recipe_title');
        this.mImageInput        = this.shadowRoot.querySelector('.editor__input.recipe_image');
        this.mPrepareTimeInput  = this.shadowRoot.querySelector('.editor__input.recipe_prepare_time');
        this.mAgeInput          = this.shadowRoot.querySelector('.ediotr__input.recipe_age');
        this.mInstructionsInput = this.shadowRoot.querySelector('.editor__input.recipe_instructions');

        // ----------------------------
        // - Mealtypes checkboxes
        // ----------------------------

        // - Checkboxes

        this.mFingerfoodInput   = this.shadowRoot.querySelector('.editor__checkbox.fingerfood');
        this.mHasToCookInput    = this.shadowRoot.querySelector('.editor__checkbox.cook');
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
        this.mInterestingInfo   = this.shadowRoot.querySelector('.editor__input.recipe:interesting_info');

    }

    initEditor(recipeDto, image)
    {
        this.mRecipeDto = recipeDto;
        this.mImage     = image;
        // Setup image

        this.mRecipeImage = image;
        //this.mFileInput.files.push(image);

        this.mTitleInput.value = recipeDto.title;
        this.mPrepareTimeInput = recipeDto.prepareTimeInMinutes;
        this.mAgeInput = recipeDto.monthsOld;
        this.mSeasonInput = setSelectedIndex(recipeDto.season);
        
        // ----------------------
        // - Parse meal types
        // ----------------------

        for (const mt of recipeDto.mealTypes)
        {
            const keys = Object.keys(mt);
            this.mMealtypeMap[keys[0]].checked = mt;
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

        this.initProducts(recipeDto.products);
        
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

        const imageFileInput = fileInputClass("step__input");
                
        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "step__rowset",
                [
                    newTagClassHTML("p", "step__label", "Image"),
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
    // - Update method section
    // ----------------------------------------------

    updateTitle(newTitle)
    {

    }

    updatePrepareTime(newTime)
    {

    }

    updateAge(newAge)
    {

    }

    updateInstructions(newInstructions)
    {

    }

    addStepByStep(stepByStepDto, file)
    {

    }

    addProduct(productDto)
    {

    }

}

window.customElements.define('recipe-editor', RecipeEditor);

export { RecipeEditor };