import { WCBase, PRODUCT_URL } from './WCBase.js';
import { FileCache } from './util/FileCache.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { RadioSwitchGroup } from './RadioSwitchGroup.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <div class='uploader'>
  <div class='uploader__frame' data-input-frame>

    <!-- REFRESH ROW -->

    <button class='button--refresh'>Reload</button>

    <text-input-row class='name_input' data-input='name' required>Name</text-input-row>
    <image-input-row class='image_input' data-input='image' required>Product Image</image-input-row>
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
    <div class='uploader__row--last'>
    </div>
    <button class='button--save save_product'>Save</button>
  </div>
  <!-- Existing products frame -->
  <div class='uploader__frame--scroll product_list'>
    <entry-browser data-browser='product_browser' data-edit=true>Products:</entry-browser>
  </div>
</div>`;

/**
 * Product View is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Manages the system products in the BFW server
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

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        this.mAddButton   = this.shadowRoot.querySelector('.button--save.save_product');
        this.mBrowser     = this.shadowRoot.querySelector('[data-browser="product_browser"]');
        
        const refreshButton = this.shadowRoot.querySelector('.button--refresh');
        refreshButton.addEventListener
        ('click', e => 
        { 
            FileCache.clearCache(PRODUCT_URL);
            this.loadProducts();
        });

        const inputFrame = this.shadowRoot.querySelector('.uploader__frame[data-input-frame]');
        const inputArray = Array.from(inputFrame.querySelectorAll('[data-input]'));

        this.mInputOperator = new InputOperator('product', inputArray);
        console.log(`InputArray lenght: ${inputArray.length}`);

        // -----------------------------------------------------------------------------
        // - Allergen group enabling/disabling setting
        // -----------------------------------------------------------------------------

        const allergenGroup = this.shadowRoot.querySelector('.allergens');
        allergenGroup.style.opacity = .25;

        const allergenInput = this.shadowRoot.querySelector('.allergens_input');
        allergenInput.addEventListener( 'state', e =>
        {
            allergenGroup.style.opacity = e.detail ? 1.0 : .25;
        }, true);

        // ------------------------------
        // - Setup button click listeners
        // ------------------------------

        this.mAddButton.addEventListener('click', e =>
        {
            // --------------------------------------
            // - Obtain input values and validate
            // - If dto and image file present, send
            // - To the server
            // --------------------------------------
   
            const dto = this.mInputOperator.processInputs();
            console.log(`Product dto key ${dto.title}, data: ${dto.data}`);

            if ( ! dto ) return;

            const imageFile = this.mInputOperator.imageFile();
            
            if ( dto && imageFile )
            {
                const responseNotifier = new ResponseNotifier
                (
                    'systemProductDto',
                    'Create Product', 
                    'Product Created Succesfully',
                    'Product Could Not Be Created' 
                );
                this.mRootElement.appendChild( responseNotifier );
                responseNotifier.onSuccess( 
                    () => {
                        
                        this.loadProducts();
                        this.mInputOperator.reset();
                    }
                );
                responseNotifier.onFail(
                    () => {
                        console.log(`Product could not be added to the server`)
                    }
                );
                responseNotifier.begin
                ( 
                    FileCache.postDtoAndImage
                    ( 
                        PRODUCT_URL, 
                        dto, 
                        imageFile
                    ) 
                );
            }
            else
            {
                console.log(`Add proper data and image file`);
            }
        }
        );

        //this.loadProducts();
    }

    /**
     * Read products from cache or from server
     */
    async loadProducts()
    {
        const { ok, status, text } = await FileCache.getCached( PRODUCT_URL );

        console.log(`GET /products response status: ${status}`);

        if ( ok )
        {
            this.generateList( text );
        }
        else
        {
            console.log(`Product read status: ${status}`);
        }
        
    }


    /**
     * Generates the product list
     * 
     * @param {array} list 
     */
    generateList( response )
    {
        let list = undefined;

        try
        {
            list = JSON.parse( response );
        }
        catch (error) 
        {
            console.log(`ProductView::generateList error ${error}`);
        }

        if ( Array.isArray( list ) )
        { 
            const model = {
                titlekey: 'name',
                fields: [
                    'productCategory',
                    'hasAllergens',
                    'hasNuts',
                    'hasEggs',
                    'hasLactose',
                    'hasGluten'
                ]
            };

            this.mBrowser.pushDataSet(list, model);
            //this.emit('product-list', {list});
            window.dispatchEvent
            (
                new CustomEvent('product-list', { bubbles: true, composed: true, detail: list})
            );
            
        }
    }

    /**
     * Builds and executes the getProducts HTTP Request
     * 
     */
    getProducts()
    {         
        return FileCache.getRequest(PRODUCT_URL);
    }

    /**
     * Builds and executes the addProduct HTTP Request
     * Returns the response from server with properties:
     * - {boolean} ok
     * - {number}  status
     * - {string}  text
     * ------------------------
     * @param  {ProductDto}  dto 
     * @param  {File}        image
     * @return {Promise}
     */
    addProduct( dto, image )
    {
        return FileCache.postDtoAndImage( PRODUCT_URL, dto, image );
    }


    /**
     * Executes HTTP DELETE by product route / id
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    removeProduct(id)
    {
        console.log(`Remove product with  ${id} called`);
        const responseNotifier = new ResponseNotifier
        ( 
            'systemProductDto',
            'Remove Product', 
            'Product Removed Succesfully',
            'Product Could Not Be Removed' 
        );
        this.mRootElement.appendChild( responseNotifier );

        responseNotifier.onSuccess
        ( 
            () => {            
                this.loadProducts();
            }
        );
        responseNotifier.onFail
        (
            () => {
                console.log(`Product could not be removed`)
            }
        );
        responseNotifier.begin( FileCache.delete( PRODUCT_URL, id ) );

    }


    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        /**
         * Listen to remove events
         */
        this.shadowRoot.addEventListener('remove-by-id', e =>
        {
            const id = e.detail.entry.id;

            e.preventDefault();
            e.stopPropagation();

            console.log(`ProductView: remove-by-id ${id}`);

            this.removeProduct(id);

        }, true);

        this.loadProducts();

    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define('product-view', ProductView);

export { ProductView };