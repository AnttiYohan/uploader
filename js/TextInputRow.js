import { WCBase, props } from './WCBase.js';

/**
 * This element is a text input, with a title
 * When 'required' attribute is set, the element
 * will display an red asterisk when left empty
 * --------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class TextInputRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Read the 'required' attribute
        // -----------------------------------------------

        let required = false;

        if (this.hasAttribute('required')) required = true;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
 
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
              <div class='component__label${required ? " required" : ""}'><slot></div>
            </div>
            <input type='text' class='component__input'>
          </div>`);

        // -----------------------------------------------------
        // - Grab the input and the required asterisk div
        // -----------------------------------------------------

        this.mInput = this.shadowRoot.querySelector('.component__input');
        const label = this.shadowRoot.querySelector('.component__label');
        
        // -----------------------------------------------------
        // - Add an input event listener, in order to remove the
        // - Red bordered required highlight, when some content
        // - is added into the input
        // -----------------------------------------------------

        if ( required )
        {
            this.mInput.addEventListener('input', e => 
            {
                if (this.mInput.value.length)
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
        /* End if (required) */
    }

    /**
     * Returns the text
     * ----------------
     * @return {String}
     */
    get value() 
    {
        return this.mInput.value;
    }

    /**
     * Clears the text input
     * ---------------------
     */
    reset()
    {
        this.mInput.value = '';
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
        console.log("<text-input-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<text-input-row> disconnected");
    }  
}

window.customElements.define('text-input-row', TextInputRow );

export { TextInputRow };