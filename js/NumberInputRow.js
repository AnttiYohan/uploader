import { WCBase, props } from './WCBase.js';

/**
 * NumberInputRow
 * ------------
 * This WebComponent is a number input,
 * with a title on the top, and a paragraph
 * at the right - a unit may be displayed there
 * When 'required' attribute is set, and the input
 * is empty/zero, the element
 * will display an red asterisk at the right hand
 * of the title
 * --------------------------------------------
 * Attributes:
 * - require : boolean
 * - unit    : string
 */
class NumberInputRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Read element attributes
        // -----------------------------------------------

        let required = this.hasAttribute('required') ? true : false;

        let unit = '';

        if (this.hasAttribute('unit')) unit = this.getAttribute('unit');

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});

        /*
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='row'>
            <div class='row__label'><slot></div>
            <input type='number' class='row__input' min='1' ${required ? "value='0'" : ""}>
            <p class='row__unit'>unit</p>
          </div>`);
            */

          this.setupTemplate
          (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
              <div class='component__row'>
                <div class='component__label${required ? " required" : ""}'><slot></div>
              </div>
              <div class='component__row'> 
                <input type='number' class='component__input type--number'>
                <p class='component__unit'>${unit}</p>
              </div>
            </div>`);

        // ---------------------------
        // - Grab the Title label and 
        // - the number input elements
        // ---------------------------

        this.mInput = this.shadowRoot.querySelector('.component__input');
        const label = this.shadowRoot.querySelector('.component__label');

        // ---------------------------
        // - If the required attribute
        // - is set, observe the input
        // - content. 
        // ---------------------------

        if ( required )
        {
            this.mInput.addEventListener('input', e => 
            {
                if (
                    this.mInput.value.length &&
                    this.mInput.valueAsNumber > 0
                    )
                {
                    if (this.mInput.classList.contains('notify-required'))
                    {   
                        this.mInput.classList.remove('notify-required');
                    }

                    if (label.classList.contains('required'))
                    {
                        label.classList.remove('required');
                    }

                }
                else
                {
                    label.classList.add('required');
                }
            });
        }
        /* End if ( required ) */
    }

    /**
     * Returns the input value
     * -----------------------
     * @return {Number}
     */
    get value() 
    {
        return this.mInput.value;
    }

    /**
     * Clears the input value to zero
     * 
     */
    reset()
    {
        this.mInput.value = 0;
    }
     
    /**
     * Adds a class into the input, which sets a red border,
     * In order to display that the input must be filled
     */
    notifyRequired()
    {
        this.mInput.classList.add('notify-required');
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<number-input-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<number-input-row> disconnected");
    }  
}

window.customElements.define('number-input-row', NumberInputRow );

export { NumberInputRow };