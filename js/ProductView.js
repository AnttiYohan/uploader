import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { InputOperator } from './util/InputOperator.js';
import { ContentBrowser } from './ContentBrowser.js';
import { ProductRow } from './ProductRow.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { RadioSwitchGroup } from './RadioSwitchGroup.js';
import { MultiEntryRow } from './MultiEntryRow.js';
import { EventBouncer } from './EventBouncer.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <div class='uploader'>
  <div class='uploader__frame' data-input-frame>

    <!-- REFRESH ROW -->

    <button class='button--refresh'>Refresh</button>

    <text-input-row class='name_input' data-input='name' required>Name</text-input-row>
    <image-input-row class='image_input' data-input='image' required>Product Image</image-input-row>
    
    <!-- PRODUCT LIST OF ALLERGENS -->

    <binary-button-row class='allergens_input' data-input='hasAllergens'>Allergens</binary-button-row>

    <div class='allergens'>
        <div class='two_column'>
           <binary-button-row class='gluten_input' data-input='hasGluten'>Gluten</binary-button-row>
           <binary-button-row class='lactose_input' data-input='hasLactose'>Lactose</binary-button-row>
        </div>
        <div class='two_column'>
          <binary-button-row class='nuts_input' data-input='hasNuts'>Nuts</binary-button-row>
          <binary-button-row class='eggs_input' data-input='hasEggs'>Eggs</binary-button-row>
        </div>
    </div>

    <!-- PRODUCT CATEGORY LIST -->

    <radio-switch-group class='category_input' data-input='productCategory' group='[
        { "title": "Bread & Pastry", "value": "BREAD_AND_PASTRY" }, 
        { "title": "Fruits", "value": "FRUITS" },
        { "title": "Vegetables", "value": "VEGETABLES" },
        { "title": "Spices", "value": "SPICES" },
        { "title": "Grains", "value": "GRAINS" },
        { "title": "Dairy", "value": "DAIRY" },
        { "title": "Meat", "value": "MEAT" },
        { "title": "Seafood", "value": "SEAFOOD" },
        { "title": "Drinks", "value": "DRINKS" },
        { "title": "Frozen & Convenience", "value": "FROZEN_AND_CONVENIENCE" },
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
    <content-browser data-input='browser'
                     class='product-browser'
                     data-list='tag'
                     data-actions='[
                         "remove"
                     ]'>Products:</content-browser>
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
        this.mProductObjects = [];

        console.log(`ProductView::constructor called`);

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`::host {
            background-image: url('assets/background-mesh.png');
            background-repeat: repeat;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .uploader__groupframe {
            margin: 16px 8px;
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
        /*
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
        }*/
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
        this.mBrowser     = this.shadowRoot.querySelector('.product-browser');
        
        const refreshButton = this.shadowRoot.querySelector('.button--refresh');
        refreshButton.addEventListener
        ('click', e => 
        { 
            FileCache.clearCache(PRODUCT_URL);
            this.loadProducts();
        });

        const inputFrame = this.shadowRoot.querySelector('.uploader__frame[data-input-frame]');
        const inputArray = Array.from(inputFrame.querySelectorAll('[data-input]'));

        this.mInputOperator = new InputOperator('products', inputArray);
        console.log(`InputArray lenght: ${inputArray.length}`);

        for (const element of inputArray)
        {
            console.log(`Input element: ${element.localName}, ${element.classList}`);
        }

        // ------------------
        // - Input references
        // ------------------

      
        // -----------------------------------------------------------------------------
        // - Allergen group enabling/disabling setting
        // -----------------------------------------------------------------------------

        const allergenInput = this.shadowRoot.querySelector('.allergens_input');
        const allergenGroup = this.shadowRoot.querySelector('.allergens');
        allergenGroup.style.opacity = 0.25;

        allergenInput.addEventListener('state', e =>
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

            //const dto = this.compileDto();
            //const imageFile = this.mFileInput.value;
   
            const dto = this.mInputOperator.processInputs();

            console.log(`Process input result: ${dto}`);

            if ( ! dto ) return;

            //const dto = this.mInputOperator.values();
            const imageFile = this.mInputOperator.imageFile();

            this.mInputOperator.reset();
            
            //const dto = this.mInputOperator.compileRequest();
            //console.log(`Dto: ${dto}`);
            //console.log(`Imagefile: ${imageFile}`);

            return;
            
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

                this.resetInputs();
            }
            else
            {
                //this.mInputOperator.notifyRequired();
                if ( imageFile === undefined ) this.mFileInput.notifyRequired();  
                 
                console.log(`Add proper data and image file`);
            }
        }
        );

        this.loadProducts();
    }

    resetInputs()
    {
        this.mInputOperator.reset();
        /*
        this.mNameInput.reset();
        this.mFileInput.reset();
        this.mAllergensInput.reset();
        this.mEggsInput.reset();
        this.mNutsInput.reset();
        this.mLactoseInput.reset();
        this.mGlutenInput.reset();
        this.mCategoryInput.reset();*/
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
     * Generates the product list
     * 
     * @param {array} list 
     */
    generateList(list)
    {
        this.mProductObjects = [];

        const titles = [];

        console.log(`ProductView::generateList, length: ${list.length}`);

        if ( Array.isArray(list) )
        {
            
            for (const item of list)
            {
                titles.push(item.name);
            }

            console.log(`Titles: ${titles}`);

            const model = [ 'name', 'amount', 'unit', 'image' ];
            this.mBrowser.pushDataSet(list, model);
            window.dispatchEvent(new CustomEvent('product-list', {detail: titles}));
            
            
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