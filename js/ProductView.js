import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <div class='uploader'>
  <!--header>
    <h3 class='uploader__header'>Products</h3>
  </header-->
  <div class='uploader__frame'>

    <!-- REFRESH ROW -->

    <div class='uploader__refreshrow'>
      <p class='uploader__paragraph'>Refresh Products</p>
      <button class='uploader__button--refresh'></button>
    </div>

    <!-- PRODUCT NAME ROW -->

    <text-input-row class='name_input' required>Name</text-input-row>

    <!-- PRODUCT IMAGE -->

    <image-input-row class='image_input'></image-input-row>

    <!-- PRODUCT CATEGORY -->

    <div class='uploader__inputrow'>
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
    </div>

    <!-- PRODUCT LIST OF ALLERGENS -->

    <div class='uploader__groupframe'>

        <!-- ALLERGENS -->
        <label class='uploader__label--checkbox'>Allergens
            <input class='uploader__checkbox has_allergens' type='checkbox'>
            <span class='uploader__checkmark'></span>
        </label>

        <div class='uploader__checkboxgroup allergen_group'>

            <!-- EGGS -->

            <label class='uploader__label--checkbox'>Eggs
                <input class='uploader__checkbox has_eggs' type='checkbox'>
                <span class='uploader__checkmark'></span>
            </label>

            <!-- NUTS -->

            <label class='uploader__label--checkbox'>Nuts
                <input class='uploader__checkbox has_nuts' type='checkbox'>
                <span class='uploader__checkmark'></span>
            </label>

            <!-- LACTOSE -->

            <label class='uploader__label--checkbox'>Lactose
                <input class='uploader__checkbox has_lactose' type='checkbox'>
                <span class='uploader__checkmark'></span>
            </label>

            <!-- GLUTEN -->

            <label class='uploader__label--checkbox'>Gluten
                <input class='uploader__checkbox has_gluten' type='checkbox'>
                <span class='uploader__checkmark'></span>
            </label>

        </div> <!-- Wrapper End for EGGS, NUTS, LACTOSE, GLUTEN -->
    </div> <!-- Wrapper End for ALLERGENS -->

    <div class='uploader__row--last'>
        <button class='uploader__button--save add_product'></button>
    </div>

  </div>

  <!-- Existing products frame -->
  <div class='uploader__frame--scroll product_list'>
  </div>
</div>`;

/**
 * 
 */
class ProductView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mDisplay = 'flex';
        this.mToken   = '';
        this.mProductObjects = [];

        console.log(`ProductView::constructor called`);

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
            margin: 16px auto;
            max-width: 600px;
            width: 300px;
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
        .uploader__groupframe {
            margin: 16px 8px;
        }
        .uploader__row--last {
            display: flex;
            flex-flow: row-reverse;
            padding: 16px;
            margin: 0 8px;
            border-bottom: 2px solid ${props.lightgrey};
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
            align-self: center;         
        }
        .uploader__inputrow--file {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            margin: 0 8px;
            border-bottom: 1px solid ${props.lightgrey};
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
            align-self: center;
        }
        .uploader__label--text,
        .uploader__label--file,
        .uploader__label--select {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
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
        .uploader__input {
            width: ${props.input_width};
            height: ${props.lineHeight};
            padding: ${props.inner_pad};
            background-color: ${props.lightgrey};
            border: none;
            outline: none;
            border-bottom: 1px solid ${props.darkgrey};
            align-self: center;
        }
        .uploader__select {
            width: ${props.input_width};
            height: ${props.lineHeight};
            padding: ${props.inner_pad};
            background-color: ${props.lightgrey};
            border: none;
            border-bottom: 1px solid ${props.darkgrey};
            outline: none;
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
            transform: translateY(8px);
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
            width: ${props.button_side};
            height: ${props.button_side};
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
            grid-template-columns: 64px auto 64px;
            padding-left: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .product__img {
            width: 48px;
            height: 48px;
            align-self: center;
            border-radius: 4px;
            box-shadow: 0 1px 15px 0px rgba(0,0,0,0.25);
        }
        .product__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
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
        this.mAddButton   = this.shadowRoot.querySelector('.uploader__button--save.add_product');
        this.mProductList = this.shadowRoot.querySelector('.uploader__frame--scroll.product_list');
        
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

        this.mNameInput         = this.shadowRoot.querySelector('.name_input');
        this.mFileInput         = this.shadowRoot.querySelector('.image_input');

        this.mCategoryInput     = this.shadowRoot.querySelector('.uploader__select.product_category');
        
        this.mHasAllergensInput = this.shadowRoot.querySelector('.uploader__checkbox.has_allergens');
        this.mHasEggsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_eggs');
        this.mHasNutsInput      = this.shadowRoot.querySelector('.uploader__checkbox.has_nuts');
        this.mHasLactoseInput   = this.shadowRoot.querySelector('.uploader__checkbox.has_lactose');
        this.mHasGlutenInput    = this.shadowRoot.querySelector('.uploader__checkbox.has_gluten');
        
        // -----------------------------------------------------------------------------
        // - Allergen group enabling/disabling setting
        // -----------------------------------------------------------------------------

        const allergenGroup = this.shadowRoot.querySelector('.allergen_group');
        allergenGroup.style.opacity = 0.25;

        this.mHasAllergensInput.addEventListener('change', e =>
        {
            console.log(`Allergen changed event: ${e.target.checked}`);
            if (! e.target.checked) allergenGroup.style.opacity = 0.25;
            else allergenGroup.style.opacity = 1.0;
        });

        // ----------------------------------------------------------------
        // - Define event listeners to listen for LoginView's custom events
        // ----------------------------------------------------------------

        window.addEventListener
        (
            "login-event", 
            e =>
            {
                console.log(`ProductView - login-event catched`);
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
        const productCategory = selectValue(this.mCategoryInput);
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