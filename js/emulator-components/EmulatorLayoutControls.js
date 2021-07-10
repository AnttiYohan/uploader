import { WCBase } from '../WCBase.js';
import { RangeInputRow } from '../RangeInputRow.js';


/**
 * Layout control UI, broadcasts layout changes
 */
class EmulatorLayoutControls extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='controls'>
           <range-input-row data-input='recipeRow' data-unit='px' data-min='24' data-max='100' data-value='64'>Recipe Row Height</range-input-row> 
        </div>`);


        this.setupStyle
        (`.controls {
           min-width: 300px;
           width: 100%;
           max-width: 1200px;
           margin: 16px auto;
           padding: 4px;
           display: flex;
           flex-wrap: wrap;
           justify-content: space-evenly;
        }
        @media screen and (max-width: 500px) {
            .controls {
                flex-direction: column;
            }
        }
        `);
        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRecipeRowHeight = this.shadowRoot.querySelector('[data-input="recipeRow"]');
    
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'emulator-layout-controls-connected' );
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'emulator-layout-controls', EmulatorLayoutControls );

export { EmulatorLayoutControls };