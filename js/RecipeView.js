import { WCBase, props, RECIPE_URL, PRODUCT_URL, MEALTYPES_ENUM, MEASURE_UNIT_ENUM } from './WCBase.js';
import 
{ 
    newTagClass, 
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    newTagClassAttrs, 
    numberInputClass, 
    selectClassIdOptionList,
    setSelectedIndex
} from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
  <!--header>
    <h3 class='uploader__header'>Recipes</h3>
  </header-->
  <div class='uploader__frame'>
    <label  class='uploader__label--text'>Title</label>
    <input  class='uploader__input  recipe_title' type='text'>
    <label  class='uploader__label--file'>Image
      <input  class='uploader__input  recipe_image' type='file'>
    </label>

    <label  class='uploader__label'>Preparation time</label>
      <input class='uploader__input recipe_preparation_time' type='number'>

    <label  class='uploader__label'>Age in months</label>
      <input class='uploader__input recipe_age' type='number'>


    <label  class='uploader__label--select'>Add Ingredient:
        <select class='uploader__select recipe_ingredients' name='recipe_ingredients'>
        </select>
    </label>

    <div class='uploader__list ingredients'>
    </div>

    <label for='instructions'  class='uploader__label--text'>Instructions</label>
    <textarea class='uploader__textarea recipe_instructions' name='instructions' rows="8"></textarea>
    
    <label class='uploader__label--checkbox'>Fingerfood
        <input class='uploader__checkbox fingerfood' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>
    <label class='uploader__label--checkbox'>Cook
        <input class='uploader__checkbox cook' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>
    <label class='uploader__label--checkbox'>Has Eggs
        <input class='uploader__checkbox has_eggs' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>
    <label class='uploader__label--checkbox'>Has Nuts
        <input class='uploader__checkbox has_nuts' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>
    <label class='uploader__label--checkbox'>Has Lactose
        <input class='uploader__checkbox has_lactose' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>
    <label class='uploader__label--checkbox'>Has Gluten
        <input class='uploader__checkbox has_gluten' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>            


    <label  class='uploader__label--select'>Season</label>
    <select class='uploader__select recipe_season' name='season'>
      <option value='WINTER'>winter</option>
      <option value='SPRING'>spring</option>
      <option value='SUMMER'>summer</option>
      <option value='AUTUMN'>autumn</option>
    </select>

    <label class='uploader__label--text'>Meal types</label>

    <div class='uploader__checkboxgroup mealtypes_group'>

        <label class='uploader__label--checkbox'>Breakfast
          <input class='uploader__checkbox breakfast' type='checkbox'>
          <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Lunch
            <input class='uploader__checkbox lunch' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Dinner
            <input class='uploader__checkbox dinner' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Snack
            <input class='uploader__checkbox snack' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Dessert
          <input class='uploader__checkbox dessert' type='checkbox'>
          <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Appetizer
            <input class='uploader__checkbox appetizer' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Salad
            <input class='uploader__checkbox salad' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Soup
            <input class='uploader__checkbox soup' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Smoothie
            <input class='uploader__checkbox smoothie' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
        <label class='uploader__label--checkbox'>Beverages
            <input class='uploader__checkbox beverages' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>
    </div>

    <label  class='uploader__label--text'>Storage info</label>
    <input  class='uploader__input  recipe_storage' type='text'>
  
    <label  class='uploader__label--text'>Tips</label>
    <input  class='uploader__input  recipe_tips' type='text'>
  
    <label  class='uploader__label'>Nutritional value</label>
    <input  class='uploader__input  recipe_nutritional_value' type='number'>

    <label  class='uploader__label--text'>Interesting info</label>
    <input  class='uploader__input  recipe_interesting_info' type='text'>

    <button class='uploader__button add_recipe'>Add</button>
  </div>


  <!-- Existing recipe frame -->
  <div class='uploader__frame recipe_list'>
  </div>
  <button class='uploader__button--refresh force_reload'>refresh</button>
</div>`;

/**
 * 
 */
class RecipeView extends WCBase
{
    constructor(token = undefined)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mDisplay = 'flex';
        this.mToken   = token;
        this.mRecipeObjects = [];
        this.mProductObjects = [];
        this.mProductMap = {};
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
            margin: 16px auto;
            max-width: 1400px;
            height: fit-content;
        }
        .uploader__header {
            font-size: ${props.header_font_size};
            color: ${props.darkgrey};
        }
        .uploader__frame {
            display: flex;
            flex-direction: column;
            margin: 16px auto;
            max-width: 600px;
            /*height: 100vh;*/
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
            padding: 4px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            border-bottom: 1px solid ${props.green};
        }
        .ingredient__row
        {
            padding: 4px;
            display: flex;
            flex-direction: row;
            height: 32px;
        }
        .ingredient__title
        {
            flex-basis: 60%;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: ${props.ingredient_height};
            margin-left: 8px;
        }
        .ingredient__amount
        {
            background: transparent;
            outline: none;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 2px solid ${props.darkgrey};
            max-width: 50px;
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
            padding: 8px;
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
        .uploader__label,
        .uploader__label--text,
        .uploader__label--file,
        .uploader__label--select {
            display: block;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: 24px;
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
        .uploader__checkmark:after {
            content: '';
            position: absolute;
            display: none;
        }
        /* Checkmark indicator display on check*/
        .uploader__label--checkbox .uploader__checkbox:checked ~ .uploader__checkmark:after {
            display: block;
        }
        /* Style the checkmark */
        .uploader__label--checkbox .uploader__checkmark:after {
            background-position-x: right;
        }
        .uploader__checkboxgroup {
            margin-top: 24px;
            border: 1px solid ${props.lightgrey};
            margin-left: ${props.checkmark_width};
        }
        .uploader__input,
        .uploader__select {
            height: ${props.lineHeight};
            margin-bottom: 12px;
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

        .uploader__button {
            cursor: pointer;
            border-radius: 4px;
            margin-top: 16px;
            font-size: ${props.header_font_size};
            font-weight: 300;
            height: ${props.lineHeight};
            color: #fff;
            background-color: ${props.red};
        }
        .uploader__button--edit {
            cursor: pointer;
            position: absolute;
            right: 48px;
            margin: 16px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_edit.svg');
        }
        .uploader__button--remove {
            cursor: pointer;
            position: absolute;
            right: 0;
            margin: 16px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_cancel.svg');
        }
        .uploader__button--refresh {
            cursor: pointer;
            position: absolute;
            right: 0;
            margin: 16px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_refresh.svg');
        }
        .uploader__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        .list__item {
            display: flex;
            height: 64px;
        }
        .list__paragraph {
            text-align: center;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            margin: 16px;
            height: 32px;
        }
        .list__thumbnail {
            margin: 8px;
            width: 48px;
            height: 48px;
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement   = this.shadowRoot.querySelector('.uploader');
        this.mAddButton     = this.shadowRoot.querySelector('.uploader__button.add_recipe');
        this.mRefreshButton = this.shadowRoot.querySelector('.uploader__button.force_reload');
        this.mRecipeList    = this.shadowRoot.querySelector('.uploader__frame.recipe_list');

        // ------------------
        // - Input references
        // ------------------

        this.mTitleInput        = this.shadowRoot.querySelector('.uploader__input.recipe_title');
        this.mFileInput         = this.shadowRoot.querySelector('.uploader__input.recipe_image');
        this.mPrepTimeInput     = this.shadowRoot.querySelector('.uploader__input.recipe_preparation_time');
        this.mAgeInput          = this.shadowRoot.querySelector('.uploader__input.recipe_age');
        
        this.mIngredientsInput  = this.shadowRoot.querySelector('.uploader__select.recipe_ingredients');
        this.mIngredientsList   = this.shadowRoot.querySelector('.uploader__list.ingredients');
        this.mInstructionsInput = this.shadowRoot.querySelector('.uploader__textarea.recipe_instructions');

        // - Checkboxes

        this.mFingerfoodInput   = this.shadowRoot.querySelector('.uploader__checkbox.fingerfood');
        this.mCookInput         = this.shadowRoot.querySelector('.uploader__checkbox.cook');
        this.mHasEggsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_eggs');
        this.mHasNutsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_nuts');
        this.mHasLactoseInput   = this.shadowRoot.querySelector('.uploader__checkbox.has_lactose');
        this.mHasGlutenInput    = this.shadowRoot.querySelector('.uploader__checkbox.has_gluten');

        this.mSeasonInput       = this.shadowRoot.querySelector('.uploader__select.recipe_season');
     
        // - Mealtype checkboxes

        this.mMealtypeMap =
        {
            "BREAKFAST": this.shadowRoot.querySelector('.uploader__checkbox.breakfast'),
            "LUNCH":     this.shadowRoot.querySelector('.uploader__checkbox.lunch'),
            "DINNER":    this.shadowRoot.querySelector('.uploader__checkbox.dinner'),
            "SNACK":     this.shadowRoot.querySelector('.uploader__checkbox.snack'),
            "DESSERT":   this.shadowRoot.querySelector('.uploader__checkbox.dessert'),
            "APPETIZER": this.shadowRoot.querySelector('.uploader__checkbox.appetizer'),
            "SALAD":     this.shadowRoot.querySelector('.uploader__checkbox.salad'),
            "SOUP":      this.shadowRoot.querySelector('.uploader__checkbox.soup'),
            "SMOOTHIE":  this.shadowRoot.querySelector('.uploader__checkbox.smoothie'),
            "BEVERAGES": this.shadowRoot.querySelector('.uploader__checkbox.beverages')
        };

        this.mStorageInfoInput  = this.shadowRoot.querySelector('.uploader__input.recipe_storage');
        this.mTipsInput         = this.shadowRoot.querySelector('.uploader__input.recipe_tips');
        this.mNutritionInput    = this.shadowRoot.querySelector('.uploader__input.recipe_nutritional_value');

        // ------------------------------
        // ------------------------------
        // - Setup button click listeners
        // ------------------------------

        this.mAddButton.addEventListener
        (
            "click",
            e =>
            {
                // --------------------------------------
                // - Obtain input values and validate
                // - If dto and image file present, send
                // - To the server
                // --------------------------------------

                const dto       = this.compileDto();
                const imageFile = this.getFileInput();

                console.log(`Dto title: ${dto.title}, data: ${dto.data}`);
                console.log(`Imagefile: ${imageFile}`);

                if ( dto && imageFile )
                {
                    this.addRecipe(dto, imageFile)
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

        //this.mToken = localStorage.getItem('token');

        //if ( ! this.mToken  )
        //{
            this.mToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGRldi5jb20iLCJhdXRoIjpbeyJhdXRob3JpdHkiOiJBRE1JTiJ9XSwiaWF0IjoxNjEwNjcxNDQzLCJleHAiOjE2MTE1MzU0NDN9.DN1lz-DrZVTBvCHJnM81nNYCxWle-IaWPdAlQgfan6o';
        //}

        //FileCache.setToken(this.mToken);

        this.loadRecipes();

        window.addEventListener
        (
            "product-list", 
            e => 
            {
                const list = e.detail;

                if (list && Array.isArray(list))
                {
                    this.setProductObjects(list);
                }
            },
            true
        );
    }

    /**
     * Update the internal product list
     * 
     * @param {array} products 
     */
    setProductObjects(products)
    {
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

            this.mIngredientsInput.appendChild
            (
                option
            );
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
        //const data = this.getProducts();

        this
            .getProducts()
            .then(data => {

                console.log(`Product response: ${data}`);
                
                try {
                
                    const list = JSON.parse(data);

                    //console.log(`PArsed data: ${list}`);

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
        const title = this.mTitleInput.value;
        const prepareTimeInMinutes = this.mPrepTimeInput.value;
        const monthsOld = this.mAgeInput.value;

        // --------------------------------------
        // - Ingredients (Products)
        // --------------------------------------

        const products = [];

        for (const elem of this.mIngredientsList.children)
        {
            const systemProductId = elem.getAttribute('data-id');
            const name = elem.querySelector('.ingredient__title').textContent;
            const amount = elem.querySelector('.ingredient__amount').value;
            const measureUnit = RecipeView.selectValue(elem.querySelector('.ingredient__unit'));
            const productCategory = elem.querySelector('.ingredient__category').textContent;;
            const recipeId = 0;
            const userId = 1; 
            if ( systemProductId ) products.push
            (
                {
                    name,
                    amount,
                    measureUnit,
                    productCategory,
                    userId,
                    systemProductId
                }
            );
        }

        const instructions = this.mInstructionsInput.value;

        // ---------------------------------------
        // - Checkbox inputs
        // ---------------------------------------
        const hasStepByStep = false;

        const fingerFood = this.mFingerfoodInput.checked;
        const hasToCook = this.mCookInput.checked;
        const hasAllergens = false;
        const hasEggs = this.mHasEggsInput.checked;
        const hasNuts = this.mHasNutsInput.checked;
        const hasLactose = this.mHasLactoseInput.checked;
        const hasGluten = this.mHasGlutenInput.checked;

        const season = RecipeView.selectValue(this.mSeasonInput);

        // - Mealtypes
        const mealTypes = [];

        for (const item of MEALTYPES_ENUM)
        {
            if (this.mMealtypeMap[item].checked)
            {
                console.log(`Mealtype ${item} checked`);
                mealTypes.push({name:item});
            }
        }

        // ---------------------------------------------
        // - Optional fields
        // ----------------------------------------------

        const storageInfo = this.mStorageInfoInput.value;
        const interestingInfo = 'default';
        const tips = this.mTipsInput.value;
        const nutritionValue = this.mNutritionInput.value;


        if 
        ( 
            title.length === 0 ||
            prepareTimeInMinutes < 1 ||
            monthsOld < 1 ||
            instructions.length === 0 ||
            products.length === 0
        )
        {
            return null;
        }

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
        };

        return { title: 'recipe', data: JSON.stringify(dataObject) };
    }

    /**
     * Returns first file in file input, if not present
     * Returns null
     * 
     * @returns File | null
     */
    getFileInput()
    {
        if ('files' in this.mFileInput && this.mFileInput.files.length)
        {
            return this.mFileInput.files[0];
        }

        return null; 
    }

    static selectValue(elem)
    {
        return elem.options[elem.selectedIndex].value;
    }

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

            // -------------------------------------
            // - Generate a remove button for this 
            // - Product Item
            // -------------------------------------

            const 
            editButton = newTagClass("button", "uploader__button--edit");
            editButton.addEventListener
            (
                "click",
                e =>
                {
                    this.editRecipe(id);
                }
            );

            const 
            removeButton = newTagClass("button", "uploader__button--remove");
            removeButton.addEventListener
            (
                "click",
                e =>
                {
                    this.removeRecipe(id);
                }
            );

            this.mRecipeList.appendChild
            (
                newTagClassChildren
                (
                    "div",
                    "list__item",
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
     * 
     */
    getRecipes()
    {         
        return FileCache.getCached(RECIPE_URL);
        //return FileCache.getRequest(PRODUCT_URL);
    }

    /**
     * Builds and executes the addRecipe HTTP Request
     * 
     * @param {RecipetDto} dto 
     * @param {File}       imageFile 
     */
    addRecipe(dto, imageFile)
    {
        return FileCache.postDtoAndImage(RECIPE_URL, dto, imageFile);
    }

    addStepByStep(dto, imageFile)
    {

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
}

window.customElements.define('recipe-view', RecipeView);

export { RecipeView };