import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
  <!--header>
    <h3 class='uploader__header'>Products</h3>
  </header-->
  <button class='uploader__button--refresh'></button>
  <div class='uploader__frame'>
    <div class='uploader__gridrow'>
      
    </div>
    <label  class='uploader__label--text'>Name</label>
    <input  class='uploader__input  product_name' type='text'>
    <label  class='uploader__label--file'>Image</label>
    <input  class='uploader__input  product_image' type='file'>
    <label  class='uploader__label--select'>Category</label>
    <select class='uploader__select product_category' name='product_category'>
      <option value='BREAD_AND_PASTRY'>Bread and pastry</option>
      <option value='FRUITS'>Fruits</option>
      <option value='VEGETABLES'>Vegetables</option>
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
    <!--label  class='uploader__label--select'>Measure unit</label>
    <select class='uploader__select product_measure_unit' name='measure_unit'>
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
    </select-->

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
    constructor(token)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mDisplay = 'flex';
        this.mToken   = token;
        this.mProductObjects = [];

        console.log(`ProductView::token: ${token}`);

        if (token && token.length)
        {
            FileCache.setToken(token);
        }
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
            width: 300px;
        }
        .uploader__refreshrow {
            display: flex;
            justify-content: space-between;
            padding: ${props.uploader_row_pad};
            height: ${props.uploader_row_height};
        }
        .uploader__gridrow {
            display: grid;
            grid-template-columns: 128px auto 64px;
            height: 48px;
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
            background-image: url('assets/icon_circle.svg');
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
            background-repeat: no-repeat;
            background-origin: center;
        }
        .product__button--delete {
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
            position: absolute;
            left: ${props.logo_side};
            top: 16px;
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
        .product__row {
            width: ${props.frame_width};
            display: grid;
            grid-template-columns: 64px auto 48px 48px;
            margin: auto;
        }
        .product__img {
            width: 48px;
            height: 48px;
            margin: 8px;
        }
        .product__label {
            text-align: center;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            margin: 16px;
            height: 32px;
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

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        this.mAddButton   = this.shadowRoot.querySelector('.uploader__button.add_product');
        this.mProductList = this.shadowRoot.querySelector('.uploader__frame.product_list');
        
        const refreshButton = this.shadowRoot.querySelector('.uploader__button--refresh');
        refreshButton.addEventListener
        ("click", e => 
        { 
            FileCache.clearCache(PRODUCT_URL);
            this.loadProducts();
        });

        // ------------------
        // - Input references
        // ------------------

        this.mNameInput         = this.shadowRoot.querySelector('.uploader__input.product_name');
        this.mFileInput         = this.shadowRoot.querySelector('.uploader__input.product_image');
        this.mCategoryInput     = this.shadowRoot.querySelector('.uploader__select.product_category');
        
        this.mHasAllergensInput = this.shadowRoot.querySelector('.uploader__checkbox.has_allergens');
        this.mHasEggsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_eggs');
        this.mHasNutsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_nuts');
        this.mHasLactoseInput   = this.shadowRoot.querySelector('.uploader__checkbox.has_lactose');
        this.mHasGlutenInput    = this.shadowRoot.querySelector('.uploader__checkbox.has_gluten');
        
        console.log(`Product list element: ${this.mProductList}`);

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

                const dto = this.compileDto();
                const imageFile = this.getFileInput();

                console.log(`Dto title: ${dto.title}, data: ${dto.data}`);
                console.log(`Imagefile: ${imageFile}`);

                if ( dto && imageFile )
                {
                    this.addProduct(dto, imageFile)
                        .then(response => 
                        {
                            console.log(`addProduct response ok: ${response}`);

                            // --------------------------
                            // - Cache cleared, 
                            // - Read all from server
                            // --------------------------

                            this.loadProducts();
                        })
                        .catch(error => { console.log(`addProduct response fail: ${error}`); });
                }
                else
                {
                    console.log(`Add proper data and image file`);
                }
            }
        );

        this.mToken = localStorage.getItem('token');


        // FileCache.setToken(this.mToken);
        this.loadProducts();
    }

    /**
     * Read products from cache or from server
     */
    loadProducts()
    {
        this.getProducts()
            .then
            (data => 
            {    
                try 
                {
                    const list = JSON.parse(data);
                    if ( list ) this.generateList(list);
                } 
                catch (error) {}
            })
            .catch(error => { console.log(`Could not read products: ${error}`); });
    }

    /**
     * Returns a product dto
     * 
     * @returns {object}
     */
    compileDto()
    {
        const name = this.mNameInput.value;
        const productCategory = ProductView.selectValue(this.mCategoryInput);
        const hasAllergens = this.mHasAllergensInput.checked;
        const hasEggs = this.mHasEggsInput.checked;
        const hasNuts = this.mHasNutsInput.checked;
        const hasLactose = this.mHasLactoseInput.checked;
        const hasGluten = this.mHasGlutenInput.checked;

        if ( name.length === 0 || productCategory.length === 0 )
        {
            return null;
        }

        const dataObject =
        {
            name,
            productCategory,
            hasAllergens,
            hasEggs,
            hasNuts,
            hasLactose,
            hasGluten
        };

        return { title: 'product', data: JSON.stringify(dataObject) };
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

    /**
     * Generates the product list
     * 
     * @param {array} list 
     */
    generateList(list)
    {
        deleteChildren(this.mProductList);
        this.mProductObjects = [];

        if ( Array.isArray(list) )
        {
            window.dispatchEvent(new CustomEvent("product-list", {detail: list}));
            for (const item of list)
            {
                const id = item.id;
                const name = item.name;
                const productCategory = item.productCategory;
            
                // - Add a product reference
                this.mProductObjects.push( { id, name, productCategory } );

                const imgElem = newTagClass("img", "product__img");
                
                if ( item.imageFile !== null )
                {
                    console.log(`Image file is present`);
                    imgElem.src = `data:${item.imageFile.fileType};base64,${item.imageFile.data}`;
                }

                // -------------------------------------
                // - Generate a remove button for this 
                // - Product Item
                // -------------------------------------

                const 
                removeButton = newTagClass("button", "product__button--delete");
                removeButton.addEventListener( "click", e => { this.removeProduct(id); } );

                // ---------------------------------------
                // - Setup a new row into the product list
                // ---------------------------------------

                this.mProductList.appendChild
                (
                    newTagClassChildren
                    (
                        "div",
                        "product__row",
                        [
                            imgElem,
                            newTagClassHTML
                            (
                                "p",
                                "product__label",
                                `${name}, ${productCategory}, ${id}`
                            ),
                            removeButton
                        ]
                    )
                );
            }
        }
    }

    /**
     * Builds and executes the getProducts HTTP Request
     * 
     */
    getProducts()
    {         
        return FileCache.getCached(PRODUCT_URL);
    }

    /**
     * Builds and executes the addProduct HTTP Request
     * 
     * @param {ProductDto} dto 
     * @param {File}       imageFile 
     */
    addProduct(dto, imageFile)
    {
        return FileCache.postDtoAndImage(PRODUCT_URL, dto, imageFile);
    }

    updateProductImage(id, imageFile)
    {

    }

    /**
     * Executes HTTP DELETE by product route / id
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    removeProduct(id)
    {
        console.log(`Remove product ${id} called`);
        FileCache
            .delete(PRODUCT_URL, id)
            .then(response => {
                console.log(`Remove prodcut response: ${response}`);

                this.loadProducts();
            })
            .catch(error => {
                console.log(`Remove product exception catched: ${error}`);
            });
    }
}

window.customElements.define('product-view', ProductView);

export { ProductView };