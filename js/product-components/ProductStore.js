import { StoreComponent } from "../StoreComponent.js";
import validate from "../util/validator.js";
import { ProductEntry } from "./ProductEntry.js";

/**
 * This is a store for Fridge Products,
 * that are being to added into a Recipe
 */
class ProductStore extends StoreComponent
{
    constructor()
    {
        super();

        /**
         * @property currentProduct
         * ---------
         * a plaeholder for the recent product object
         */
        this.mCurrentProduct = undefined;

    }

    /**
     * Reset the store and push a set of products
     * 
     * @param {array} products 
     */
    pushDataSet( products )
    {
        this.reset();

        if ( products && Array.isArray( products ) ) for ( const product of products )
        {
            this.addProduct( product );
        }
    }

    /**
     * Extended add product in
     */
    addProduct( product )
    {
        const entries  = this.entries;
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
            this.addEntry( productEntry );
            //if ( ! productEntry.fail ) this.addEntry( productEntry );
            if ( this.count && this.mFrame.classList.contains( 'notify-required' ) ) 
            {
                this.mFrame.classList.remove( 'notify-required' );
            }
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
            
            const model = 
            [{
                prop: 'name',
                type: 'string',
                empty: 'false'
            },
            {
                prop: 'userId',
                type: 'number',
                empty: 'false'
            },
            {
                prop: 'productCategory',
                type: 'string',
                empty: 'false'
            },
            {
                prop: 'systemProductId',
                type: 'number',
                empty: 'false'
            },
            {
                prop: 'amount',
                type: 'number',
                empty: 'false'
            },
            {
                prop: 'measureUnit',
                type: 'string',
                empty: 'false'
            }];

            /**
             * Validate
             */
            if ( validate( entry, model ) )
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
     * Adds a class into the image area element, to display
     * a red border -- when ensure is set,
     * the notification fires only when the input is not set
     * ------
     * @param {boolean} ensure
     */
    notifyRequired(ensure = true)
    {
        if ( ! ensure || ! this.value ) this.mFrame.classList.add( 'notify-required' );
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
        this.emit( 'product-store-connected' );
        const sendAllergens = () =>
        {
            this.shadowRoot.dispatchEvent
            (
                new CustomEvent( 'allergens-map', 
                {
                    bubbles: true,
                    composed: true,
                    detail: 
                    {
                        'allergens': this.allergenMap
                    }
                })
            );

            this.checkAsterisk();
        }
        /**
         * Listen to product-entry-removed events, 
         * broadcast the allergen map into the recipes
         */
        this.listen( 'product-entry-added', sendAllergens );
        this.listen( 'product-entry-removed', sendAllergens );
    }


}


window.customElements.define( 'product-store', ProductStore );

export { ProductStore };