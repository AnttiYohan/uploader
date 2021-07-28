import { StoreComponent } from "../StoreComponent.js";
import { ProductEntry } from "./ProductEntry.js";

/**
 * This is a store for Fridge Products,
 * that are being to added into a Recipe
 */
class ProductStore extends StoreComponent
{
    constructor()
    {
        const template = 
        `<div class='component__row'>
            <p class='component__label'>Baby template</p>
        </div>`;

        super( { template } );
    }

    /**
     * Extended add product in
     */
    addProduct( product )
    {
        this.addEntry( new ProductEntry( product ) );
    }
}


window.customElements.define( 'product-store', ProductStore );

export { ProductStore };