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

        const style = 
        `.row--button { margin-bottom: 24px; }
        .store {
            min-height:600px;
            justify-content: center;
        }`;

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
        this.enumerate();
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
        this.listen( 'step-entry-connected', e => this.enumerate() );
        this.listen( 'step-entry-disconnected', e => this.enumerate() );
        
        /**
         * Add dragover listener
         */
        this.mStore.addEventListener( 'dragover', e => {

            e.preventDefault();
            const y = e.clientY;
            const parentTop = this.offsetTop;
        
            for ( const child of this.children )
            {
                const entryTop = child.offsetTop - parentTop;

                if ( y >= entryTop && y <= entryTop + 114 )
                {
                    child.classList.add('dragged');
                }
                else
                {
                    child.classList.remove('dragged');
                }
            }

        });

        this.mStore.addEventListener( 'drop', e => {

            e.preventDefault();

            const y = e.clientY;
    
            // - Check the index
            const parentTop = this.offsetTop;
            let index = 1;
            let dropIndex = 1;
            let dropped = false;

            for ( const child of this.children )
            {
                const entryTop = child.offsetTop - parentTop;
                child.classList.remove('dragged');

                if ( y >= entryTop && y <= entryTop + 114 )
                {
                    dropped = true;
                    dropIndex = index;
                }
        
                index++;
            }

            if ( dropped )
            {
                const original = Number(e.dataTransfer.getData("text"));                
                
                if ( original !== dropIndex )
                {
                    this.swap( original, dropIndex );
                }
            }
        });
    }
}


window.customElements.define( 'step-store', StepStore );

export { StepStore };