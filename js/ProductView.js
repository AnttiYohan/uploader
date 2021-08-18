import { ViewBase } from './ViewBase.js';
import { FileCache } from './util/FileCache.js';
import { PRODUCT_URL } from './WCBase.js';
import { InputOperator } from './util/InputOperator.js';
import { ResponseNotifier } from './ResponseNotifier.js';
import { RadioSwitchGroup } from './RadioSwitchGroup.js';

/**
 * Product View is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Manages the system products in the BFW server
 */
class ProductView extends ViewBase
{
    constructor()
    {
        const template =
        `<text-input-row class='name_input' data-input='name' required>Name</text-input-row>
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
        ]'>Category</radio-switch-group>`;

        /**
         * Pass to the base:
         * - entity name
         * - route
         * - options { editable, responseKey, titleKey, template }
         */
        super
        (
            'product',
            PRODUCT_URL,
            { 
                editable: true, 
                responseKey: 'systemProductDto', 
                titleKey: 'name',
                template
            }
        );
        
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

    }

    /**
     * Overload the base class loadEntities, 
     * call it first and add broadcast the products when fetched
     */
    async loadEntities()
    {
        const products = await super.loadEntities( [ 'productCategory', 'hasAllerges' ] );
        if ( products && Array.isArray( products ) )
        {
            window.dispatchEvent
            (
                new CustomEvent('product-list', { bubbles: true, composed: true, detail: products })
            );
        }
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define('product-view', ProductView);

export { ProductView };