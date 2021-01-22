import { WCBase, props, RECIPE_URL, PRODUCT_URL } from './WCBase.js';
import { ProductDto }    from './dto/ProductDto.js';
import { RecipeDto } from "./dto/RecipeDto.js";
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, newTagClassAttrs } from './util/elemfactory.js';
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
    <label  class='uploader__label--file'>Image</label>
    <input  class='uploader__input  recipe_image' type='file'>
    <label  class='uploader__label--select'>Ingredients/label>
    <select class='uploader__select recipe_ingredients' name='recipe_ingredients'>
    </select>
    <div class='uploader__list ingredients'>
    </div>
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

    <button class='uploader__button add_recipe'>Add</button>
  </div>

  <!-- Existing recipe frame -->
  <div class='uploader__frame recipe_list'>
  </div>
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
            height: 100vh;
        }
        .uploader__list
        {
            background-color: ${props.lightgrey};
            border-left: 1px solid ${props.grey};
            box-shadow: -1px 1px 3px 4px rgba(0,0,0,0.25);
        }
        .uploader__item
        {
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: 24px;
            margin-left: 8px;
            border-bottom: 1px solid ${props.green};
        }
        .uploader__label--text,
        .uploader__label--file,
        .uploader__label--select {
            display: block;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: 24px;
        }
        .uploader__checkboxgroup {
            border: 1px solid ${props.lightgrey};
            margin-left: ${props.checkmark_width};
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
        .uploader__input,
        .uploader__select {
            height: ${props.lineHeight};
            margin-bottom: 12px;
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

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        this.mAddButton   = this.shadowRoot.querySelector('.uploader__button.add_recipe');

        // ------------------
        // - Input references
        // ------------------

        this.mTitleInput        = this.shadowRoot.querySelector('.uploader__input.recipe_title');
        this.mFileInput         = this.shadowRoot.querySelector('.uploader__input.recipe_image');
        this.mIngredientsInput  = this.shadowRoot.querySelector('.uploader__select.recipe_ingredients');
        this.mIngredientsList   = this.shadowRoot.querySelector('.uploader__list.ingredients');
        this.mSeasonInput       = this.shadowRoot.querySelector('.uploader__select.recipe_season');
     
        // - Mealtype checkboxes

        this.mMealtypeBreakfast = this.shadowRoot.querySelector('.uploader__checkbox.breakfast');

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
                    this
                        .addRecipe(dto, imageFile)
                        .then(response => {

                            console.log(`addRecipe response ok: ${response}`);

                            // --------------------------
                            // - Cache cleared, 
                            // - Read all from server
                            // --------------------------

                            this.loadRecipes();
                        })
                        .catch(error => {

                            console.log(`addRecipe response fail: ${error}`);

                        });
                }
                else
                {
                    console.log(`Add proper data and image file`);
                }


            }
        );
        //this.mToken = localStorage.getItem('token');

        //if ( ! this.mToken  )
        //{
            this.mToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGRldi5jb20iLCJhdXRoIjpbeyJhdXRob3JpdHkiOiJBRE1JTiJ9XSwiaWF0IjoxNjEwNjcxNDQzLCJleHAiOjE2MTE1MzU0NDN9.DN1lz-DrZVTBvCHJnM81nNYCxWle-IaWPdAlQgfan6o';
        //}

        //FileCache.setToken(this.mToken);

        //this.loadRecipes();
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

    setProductObjects(products)
    {
        this.mProductObjects = products;

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
            option.value = product.name;

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

                console.log(`change target: ${value}`);

                this.mIngredientsList.appendChild
                (
                    newTagClassAttrs("div", "uploader__item", {"data-id":value}, value)
                );
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
     * Returns a recipe dto
     * 
     * @returns {object}
     */
    compileDto()
    {
        const title = this.mTitleInput.value;

        if 
        ( 
            title.length === 0 
        )
        {
            return null;
        }

        const dataObject =
        {
            title
        };

        return { 

            title: 'recipe',
            data: JSON.stringify(dataObject)

        };
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
        console.log(`Product amount: ${list.length}`);

        deleteChildren(this.mRecipeList);
        this.mRecipeObjects = [];

        if ( Array.isArray(list) ) for (const item of list)
        {
            const id = item.id;
            const title = item.title;
           
            // - Add a product reference
            this.mRecipeObjects.push
            ({title});

            const 
            imgElem = newTagClass("img", "list__thumbnail");
            
            if ( item.imageFile !== null )
            {
                console.log(`Image file is present`);
                imgElem.src = `data:${item.imageFile.fileType};base64,${item.imageFile.data}`;
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

            this.mRecipetList.appendChild
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
                            `${title}, ${productCategory}, ${id}`
                        ),
                        editButton,
                        removeButton
                    ]
                )
            );
        }

        console.log(`Items in list ready`);
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