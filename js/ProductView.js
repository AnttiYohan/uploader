import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { RadioSwitchGroup } from './RadioSwitchGroup.js';

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

    <image-input-row class='image_input'>Product Image</image-input-row>

    <!-- PRODUCT LIST OF ALLERGENS -->

    <binary-button-row class='allergens_input'>Allergens</binary-button-row>

    <div class='allergens'>
        <div class='two_column'>
           <binary-button-row class='gluten_input'>Gluten</binary-button-row>
           <binary-button-row class='lactose_input'>Lactose</binary-button-row>
        </div>
        <div class='two_column'>
          <binary-button-row class='nuts_input'>Nuts</binary-button-row>
          <binary-button-row class='eggs_input'>Eggs</binary-button-row>
        </div>
    </div>

    <!-- PRODUCT CATEGORY LIST -->

    <radio-switch-group class='category_input' group='[
        { "title": "Bread&Pastry", "value": "BREAD_AND_PASTRY" }, 
        { "title": "Fruits", "value": "FRUITS" },
        { "title": "Vegetables", "value": "VEGETABLES" },
        { "title": "Spices", "value": "SPICES" },
        { "title": "Grains", "value": "GRAINS" },
        { "title": "Dairy", "value": "DAIRY" },
        { "title": "Meat", "value": "MEAT" },
        { "title": "Seafood", "value": "SEAFOOD" },
        { "title": "Drinks", "value": "DRINKS" },
        { "title": "Frozen&Convenience", "value": "FROZEN_AND_CONVENIENCE" },
        { "title": "Others", "value": "OTHERS" },
        { "title": "None", "value": "NONE" }
    ]'>Category</radio-switch-group>


    <!-- SAVE BUTTON -->

    <div class='uploader__row--last'>
    </div>

    <button class='button--save save_product'>Save</button>

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
        .two_column {
            width: 100%;
            display: grid;
            grid-template-columns: 50% 50%;
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
        this.mAddButton   = this.shadowRoot.querySelector('.button--save.save_product');
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
        this.mAllergensInput    = this.shadowRoot.querySelector('.allergens_input');
        this.mEggsInput         = this.shadowRoot.querySelector('.eggs_input');
        this.mNutsInput         = this.shadowRoot.querySelector('.nuts_input');
        this.mLactoseInput      = this.shadowRoot.querySelector('.lactose_input');
        this.mGlutenInput       = this.shadowRoot.querySelector('.gluten_input');
        this.mCategoryInput     = this.shadowRoot.querySelector('.category_input');
      
        // -----------------------------------------------------------------------------
        // - Allergen group enabling/disabling setting
        // -----------------------------------------------------------------------------

        const allergenGroup = this.shadowRoot.querySelector('.allergens');
        allergenGroup.style.opacity = 0.25;

        this.mAllergensInput.addEventListener('state', e =>
        {
            console.log(`Allergen state event: ${e.detail}`);
            if (! e.detail) 
            {   
                allergenGroup.style.opacity = 0.25;
            }
            else allergenGroup.style.opacity = 1.0;
        }, true);

        // ------------------------------
        // - Setup button click listeners
        // ------------------------------

        this.mAddButton.addEventListener('click', e =>
        {
            console.log(`Save product clicked`);
            // --------------------------------------
            // - Obtain input values and validate
            // - If dto and image file present, send
            // - To the server
            // --------------------------------------

            const dto = this.compileDto();
            const imageFile = this.mFileInput.value;
            //const imageFile = this.getFileInput();

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

        // ----------------------------------------------------
        // - Read has allergens input, if it is not set, leave
        // - all the allergen groups as false
        // ----------------------------------------------------

        const hasAllergens = this.mAllergensInput.state;
        let hasEggs     = false;
        let hasNuts     = false;
        let hasLactose  = false;
        let hasGluten   = false;

        if (hasAllergens)
        {
            hasEggs     = this.mEggsInput.state;
            hasNuts     = this.mNutsInput.state;
            hasLactose  = this.mLactoseInput.state;
            hasGluten   = this.mGlutenInput.state;
        }

        // -----------------------------------------------
        // - Read the active product category
        // -----------------------------------------------

        const productCategory = this.mCategoryInput.active;
       
        // -----------------------------------------------
        // - Ensure that the name and category are defined
        // -----------------------------------------------

        if ( name.length === 0 || productCategory.length === 0 )
        {
            return null;
        }

        // ----------------------------------------------------
        // - Construct and return the product DTO
        // ----------------------------------------------------

        const dataObject =
        {
            name,
            hasAllergens,
            hasEggs,
            hasNuts,
            hasLactose,
            hasGluten,
            productCategory
        };

        return { title: 'product', data: JSON.stringify(dataObject) };
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
            window.dispatchEvent(new CustomEvent('product-list', {detail: list}));
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