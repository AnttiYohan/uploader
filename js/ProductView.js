import { WCBase, props, PRODUCT_URL } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { EntryBrowser } from './EntryBrowser.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { InputOperator } from './util/InputOperator.js';
import { RadioSwitchGroup } from './RadioSwitchGroup.js';


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
    <entry-browser data-browser='product_browser'>Products:</entry-browser>
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
   
            const dto = this.mInputOperator.processInputs();
            console.log(`Product dto key ${dto.title}, data: ${dto.data}`);

            if ( ! dto ) return;

            const imageFile = this.mInputOperator.imageFile();
            
            if ( dto && imageFile )
            {
                this.addProduct(dto, imageFile)
                    .then(response => 
                    {
                        const ok     = response.ok;
                        const status = response.status;
                        console.log(`addProduct response status ${status} : ok? ${ok}`);

                        if (ok)
                        {
                            console.log(`Product added succesfully ${response.text}`);
                            this.loadProducts();
                            this.mInputOperator.reset();
                        }
                        else
                        {
                            console.log(`Product could not be added to the server, code ${status}`)
                        }
                    })
                    .catch(error => { console.log(`addProduct response fail: ${error}`); });

                this.mInputOperator.reset();
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
    loadProducts()
    {
        this.getProducts()
        .then(response => 
        { 
            try { this.generateList( JSON.parse(response.text)); } 
            catch (error) { throw new Error(`Product parse failed: ${error}`); }
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
        return FileCache.getCached(PRODUCT_URL);
    }

    /**
     * Builds and executes the addProduct HTTP Request
     * Returns the response from server with properties:
     * - {boolean} ok
     * - {number}  status
     * - {string}  text
     * ------------------------
     * @param  {ProductDto} dto 
     * @param  {File}       imageFile
     * @return {boolean, number, string}
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

                console.log(`Remove product response status: ${response.status} - ${response.text}`);

                if (response.ok)
                {
                    console.log(`Product succesfully removed from the server`);
                    this.loadProducts();
                }
                else
                {
                    console.log(`Server was unable to remove the product`);
                }
            })
            .catch(error => {
                console.log(`Remove product exception catched: ${error}`);
            });
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
            const id = e.detail.id;

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