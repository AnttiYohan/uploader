import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { ProductDto }    from './dto/ProductDto.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
  <!--header>
    <h3 class='uploader__header'>Products</h3>
  </header-->
  <div class='uploader__frame'>
    <label  class='uploader__label--text'>Name</label>
    <input  class='uploader__input  product_name' type='text'>
    <label  class='uploader__label--file'>Image</label>
    <input  class='uploader__input  product_image' type='file'>
    <label  class='uploader__label--select'>Category</label>
    <select class='uploader__select product_category' name='product_category'>
      <option value='BREAD_AND_PASTRY'>Bread and pastry</option>
      <option value='FRUITS'>Fruits</option>
      <option value='VEGETABLES'>Fruits</option>
      <option value='SPICES'>Spices</option>
      <option value='GRAINS'>Grains</option>
      <option value='DAIRY'>Dairy</option>
      <option value='MEAT'>Meat</option>
      <option value='SEAFOOD'>Seafood</option>
      <option value='DRINKS'>Drinks</option>
      <option value='FROZEN_AND_CONVENIENCE'>Frozen and convenience</option>
      <option value='OTHERS'>Others</option>
      <option value='NONE'>None</option>
    </select>
    <label  class='uploader__label--select'>Measure unit</label>
    <select class='uploader__select measureunit' name='measureunit'>
      <option value='ML'>ml</option>
      <option value='LITER'>liter</option>
      <option value='GR'>gr</option>
      <option value='PIECES'>pieces</option>
      <option value='CUP'>cup</option>
      <option value='CUPS'>cups</option>
      <option value='TSP'>tsp</option>
      <option value='TBSP'>tbsp</option>
      <option value='CLOVE'>clove</option>
      <option value='CAN'>can</option>
      <option value='CANS'>cans</option>
      <option value='SLICE'>slice</option>
      <option value='SLICES'>slices</option>
      <option value='A_PINCH_OF'>pinch</option>
      <option value='NONE'>none</option>
    </select>

    <label class='uploader__label--text'>Nutritional info
      <input class='uploader__input nutritional_info' type='text'>
    </label>

    <!-- Checkbox options -->

    <label class='uploader__label--checkbox'>Allergens
        <input class='uploader__checkbox has_allergens' type='checkbox'>
        <span class='uploader__checkmark'></span>
    </label>

    <div class='uploader__checkboxgroup allergen_group'>

        <label class='uploader__label--checkbox'>Eggs
          <input class='uploader__checkbox has_eggs' type='checkbox'>
          <span class='uploader__checkmark'></span>
        </label>

        <label class='uploader__label--checkbox'>Nuts
            <input class='uploader__checkbox has_nuts' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>

        <label class='uploader__label--checkbox'>Lactose
            <input class='uploader__checkbox has_lactose' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>

        <label class='uploader__label--checkbox'>Gluten
            <input class='uploader__checkbox has_gluten' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>

    </div>

    <button class='uploader__button add_product'>Add</button>
  </div>

  <!-- Existing products frame -->
  <div class='uploader__frame product_list'>
  </div>
</div>`;

/**
 * 
 */
class ProductView extends WCBase
{
    constructor(token = undefined)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mDisplay = 'flex';
        this.mToken   = token;

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
        .uploader__label--text,
        .uploader__label--select {
            display: block;
            height: ${props.lineHeight};
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
        }
        .uploader__label--checkbox:hover ~ .uploader__checkmark {
            background-color: ${props.lightgrey};
        }
        .uploader__label--checkbox .uploader__checkbox:checked ~ .uploader__checkmark {
            background-color: ${props.red};
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
            left: 9px;
            top: 5px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }
        .uploader__input {
            height: ${props.lineHeight};
        }
        .uploader__button {
            margin-top: 16px;
            font-weight: 200;
            height: ${props.lineHeight};
            color: ${props.buttonColor};
            background-color: ${props.buttonBg};
        }
        .uploader__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        .uploader__li {
            display: flex;
            height: 64px;
        }
        .uploader__thumbnail {

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
        this.mAddButton = this.shadowRoot.querySelector('.uploader__button.add_product');
        this.mProductList = this.shadowRoot.querySelector('uploader__frame.product_list');

        // ----------------------------------------------------------------
        // - Define event listeners to listen for LoginView's custom events
        // ----------------------------------------------------------------

        window.addEventListener
        (
            "login-event", 
            e =>
            {
                console.log(`UploaderView - login-event catched`);

                // ----------------------------------
                // - Grab the token from local store
                // ----------------------------------


                // ----------------------------------
                // - Turn the root element display on
                // ----------------------------------

                this.mRootElement.style.display = 'flex';
            },
            true
        );

        // ---------------------------
        // - Setup login functionality
        // ---------------------------
        //this.mToken = localStorage.getItem('token');

        //if ( ! this.mToken  )
        //{
            this.mToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGRldi5jb20iLCJhdXRoIjpbeyJhdXRob3JpdHkiOiJBRE1JTiJ9XSwiaWF0IjoxNjEwNjcxNDQzLCJleHAiOjE2MTE1MzU0NDN9.DN1lz-DrZVTBvCHJnM81nNYCxWle-IaWPdAlQgfan6o';
        //}
        this.loadProducts();

    }

    loadProducts()
    {
        this
            .getProducts()
            .then(data => {

                console.log(`Product response: ${data}`);

            })
            .catch(error => {

                console.log(`Could not read products: ${error}`);

            });
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
    async getProducts()
    {         
        const bearer = `Bearer ${this.mToken}`;

        console.log(`Authorization: ${bearer}`);
        const response = await fetch
        (
            PRODUCT_URL,
            {
                method: 'GET',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                }
            }
        );
        
        return await response.text();
    }

    /**
     * Builds and executes the addProduct HTTP Request
     * 
     * @param {ProductDto} dto 
     * @param {File}      file 
     */
    async addProduct(dto, file)
    {
        if ( email.length > 1 && password.length > 5 )
        {
            const 
            formData = new FormData();
            formData.append('name',      dto.name );
            formData.append('hasGluten', dto.hasGluten );
            formData.append('image',     file );

            const response = await fetch
            (
                PRODUCT_URL,
                {
                    method: 'POST',
                    body: formData
                }
            );
            
            return await response.text();
        }

        return undefined;
    }
}

window.customElements.define('product-view', ProductView);

export { ProductView };