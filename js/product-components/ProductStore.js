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

        /**
         * @property currentProduct
         * ---------
         * a plaeholder for the recent product object
         */
        this.mCurrentProduct = undefined;

    }

    /**
     * Extended add product in
     */
    addProduct( product )
    {
        const entries = this.entries;
        let   conflict = false;

        for ( const entry of entries )
        {
            if ( product.name === entry.name )
            {
                conflict = true;
                break;
            }
        }

        if ( ! conflict )
        {
            const productEntry = new ProductEntry( product );
            if ( productEntry instanceof ProductEntry ) this.addEntry( productEntry );
        } 
    }

    /**
     * Iterate though the entries and return the valid ones,
     * If no valid entries, return undefined
     * 
     * @return {Array<object>|undefined}
     */
    get value()
    {
        const result = [];

        for ( const entry of this.entries )
        {
            const {

                name,
                userId,
                productCategory,
                systemProductId,
                amount,
                measureUnit

            } = entry;

            /**
             * Validate
             */
            if (

                name                    && 
                name.length             && 
                userId > 0              && 
                productCategory         && 
                productCategory.length  &&
                systemProductId > 0     &&
                amount                  && 
                amount > 0              &&
                measureUnit.length

            )
            {
                result.push( entry );
            }
        }

        return result.length ? result : undefined;
    }

    /**
     * Receives a connection from an EventBouncer
     * 
     * @param   {ProductDto} product 
     * @returns 
     */
    applyConnection( product )
    {
        const key = 'name';

        if ( ! product.hasOwnProperty( key ) )
        {
            console.log( `ProductStore::applyConnection() product ${product} has no key` );
            return;
        }

        this.mCurrentProduct = product;

        this.addProduct( product );
    }

    /**
     * Ensures that the asterisk of requirement
     * is properly set
     */
    checkAsterisk()
    {
        const clist = this.mAsteriskLabel.classList;
        this.count ? clist.add('off') : clist.remove('off');
    }

    /**
     * Adds a class into the image area element, to display
     * a red border -- when ensure is set,
     * the notification fires only when the input is not set
     * ------
     * @param {boolean} ensure
     */
    notifyRequired(ensure = true)
    {
        if ( ! ensure || ! this.value ) this.mFrame.classList.add('notify-required');
    }
    
    /**
     * Create a truth value map of allergens in stored products
     */
    get allergenMap()
    {
        const map = {

            hasAllergens: false,
            hasNuts:      false,
            hasEggs:      false,
            hasGluten:    false,
            hasLactose:   false

        };

        for ( const entry of this.children )
        {
            const { hasAllergens, hasNuts, hasEggs, hasGluten, hasLactose} = entry.allergens;

            if ( hasAllergens ) map.hasAllergens = true;
            if ( hasNuts )      map.hasNuts      = true;
            if ( hasEggs )      map.hasEggs      = true;
            if ( hasGluten )    map.hasGluten    = true;
            if ( hasLactose )   map.hasLactose   = true;
        }

        return map;
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log( '<product-store> connected' );

        function sendAllergens()
        {
            this.shadowRoot.dispatchEvent
            (
                new CustomEvent('allergens-map', 
                {
                    bubbles: true,
                    composed: true,
                    detail: 
                    {
                        'allergens': this.allergenMap
                    }
                })
            );
        }
        /**
         * Listen to product-entry-removed events, 
         * broadcast the allergen map into the recipes
         */
        this.shadowRoot.addEventListener( 'product-entry-added',   sendAllergens, true );
        this.shadowRoot.addEventListener( 'product-entry-removed', sendAllergens, true );
        
        const products = [

            {
                name: 'Potatoes',
                productCategory: 'VEGETABLES',
                systemProductId: 1
            },
            {
                name: 'Salt',
                productCategory: 'SPICES',
                systemProductId: 2
            },
            {
                name: 'Sugar',
                productCategory: 'SPICES',
                systemProductId: 3
            }

        ];

        /*for ( const p of products )
        {
            this.addProduct( p );
        }*/
    }


}


window.customElements.define( 'product-store', ProductStore );

export { ProductStore };