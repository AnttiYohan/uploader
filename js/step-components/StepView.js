import { deleteChildren } from '../util/elemfactory.js';
import { WCBase, props } from '../WCBase.js';
import { StepEntry } from './StepEntry.js';

/**
 * Creates and manipulates the Recipe Steps
 * Utilizes as an basic entry unit
 * @component StepEntry
 */
class StepView extends WCBase
{
    constructor()
    {
        super();

        /** Unique string as key for HTTP Request */

        this.mKey   = this.dataset.input ? this.dataset.input : 'steps';

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
               <p class='component__label'>Steps</p>
            </div>
            <div class='component__row row--button'>
                <button class='button'>Add</button>
            </div>
            <div class='store'>
            </div>
          </div>`);

        this.setupStyle
        (`
        .component { background-color: #fff; border-radius: 4px; box-shadow: 0 8px 12px -2px rgba(20,0,0,.25); }
        .row--button { margin-bottom: 24px; }
        .button { display: block; margin: auto; }
        .store { display: flex; flex-direction: column; }
        `);

        this.mStore = this.shadowRoot.querySelector( '.store' );

       /**
        * Create the add button listeners
        */
       const addButton = this.shadowRoot.querySelector( '.button' );
       addButton.addEventListener('click', e => 
       {
           this.mStore.appendChild( new StepEntry() );
       });

       this.shadowRoot.addEventListener( 'dragover', e =>
       {
           e.preventDefault();
       });

       this.shadowRoot.addEventListener( 'drop', e =>
        {
            e.preventDefault();
            const text = e.dataTransfer.getData( 'text' );
            console.log( `Text from dropped: ${text}` );
        });

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
    
    get entries()
    {
        const result = [];
        let   stepNumber = 0;

        for ( const entry of this.mStore.children )
        {
            const { text, image } = entry.value;

            if ( image && text.length )
            {
                stepNumber++;
                result.push({text, stepNumber, image});
            }
        }

        return result;
    }  
  
    get value()
    {
        const  entries = this.entries;
        return entries.length ? entries : undefined;
    }

    object()
    {
        const  result = this.value;
        return result ? {[this.mKey]: result} : result;
    }
  
    /**
     * Return required status
     * ---------------
     * @return {boolean}
     */
    get required()
    {
        return false;
    }

    reset()
    {
        deleteChildren( this.mStore );
    }

    get count()
    {
        return this.mStore.children.length;
    }

    /**
     * method stub
     */
    notifyRequired( ensure = true ) 
    {
        return '';
    }  

    pushDataSet( set )
    {
        deleteChildren( this.mStore );
        let stepNumber = 0;

        for ( const entry of set )
        {
            if ( 'image' in entry && 'text' in entry )
            {
                const { image, text } = entry;

                this.mStore.appendChild
                (
                    new StepEntry({

                        text,
                        image,
                        stepNumber

                    })
                );
            }
        }
    }
    
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log( '<step-view> connected' );
        this.emit( 'step-view-conntected' );
    }

}

window.customElements.define( 'step-view', StepView );

export { StepView };