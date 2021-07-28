import { StoreComponent } from "../StoreComponent.js";
import { StepEntry } from "./StepEntry.js";
import { validate } from '../util/validator.js';

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

        const addButton = this.shadowRoot.querySelector( '.button' );
        addButton.addEventListener( 'click', e => this.addStep() );
    }

    /**
     * Reset the store and push a set of steps
     * Validate the steps
     * @param {array} steps 
     */
    pushDataSet( steps )
    {
        this.reset();

        if ( steps && Array.isArray( steps ) ) for ( const step of steps )
        {
            const validationModel = 
            [
                {
                    prop:  'text',
                    type:  'string',
                    empty: 'false'
                },
                {
                    prop:  'mediaDto'
                }
            ];

            if ( validate( step, validationModel ) )
            {
                this.addStep( step );
            }
        }
    }


    /**
     * Extended add product in
     */
    addStep( step = {} )
    {
        this.addEntry( new StepEntry( step ) );
    }

    /**
     * Iterates though the stored fields and
     * Sets the field number to match current row
     */
    enumerate()
    {
        let index = 1;

        for ( const entry of this.mStore.children )
        {
            entry.stepNumber = index++;
        }        
    }
    
    /**
     * Returns the valid entries, or - if none, undefied
     * 
     * @return {Array<object>|null}
     */
    get value()
    {
        const result   = [];
        let stepNumber = 0;

        for ( const entry of this.entries )
        {
            const { text, image } = entry;

            if ( image && text && text.length )
            {
                stepNumber++;
                result.push( { text, image, stepNumber } );
            }
        }

        return result.length ? result : undefined;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log( '<step-store> connected' );
        this.emit( 'step-store-connected' );
    }


}


window.customElements.define( 'step-store', StepStore );

export { StepStore };