import { StoreComponent } from "../StoreComponent.js";
import { StepEntry } from "./StepEntry.js";

/**
 * This is a store for StepEntry components,
 * that are being to added into a Recipe
 */
class StepStore extends StoreComponent
{
    constructor()
    {
        const template = 
        `<div class='component__row row--button'>
            <button class='button'>Add</button>
        </div>`;

        const style = `.row--button { margin-bottom: 24px; }`;

        super( { template, style } );
    }

    /**
     * Extended add product in
     */
    addStep( step )
    {
        const stepEntry = new StepEntry( step ); 
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log( '<product-store> connected' );
        
        const steps = [

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

        for ( const step of steps )
        {
            this.addStep( step );
        }
    }


}


window.customElements.define( 'step-store', StepStore );

export { StepStore };