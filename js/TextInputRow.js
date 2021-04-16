import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class TextInputRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mNotifyFlag = false;

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
              <div class='component__label'><slot></div>
              <div class='component__img--required'></div>
            </div>
            <input type='text' class='component__input' ${required ? 'required' : ''}>
         </div>`);

        // -----------------------------------------------------
        // - Grab the input and the required asterisk div
        // -----------------------------------------------------

        this.mInput = this.shadowRoot.querySelector('.component__input');

        const asterisk = this.shadowRoot.querySelector('.component__img--required');

        // -----------------------------------------------------
        // - Add an input event listener, in order to remove the
        // - Red bordered required highlight, when some content
        // - is added into the input
        // -----------------------------------------------------

        this.mInput.addEventListener('input', e => 
        {
            if (this.mInput.value.length)
            {
                if (this.mInput.classList.contains('notify-required'))
                {   
                    this.mInput.classList.remove('notify-required');
                }

                if (asterisk.style.display !== 'none')
                {
                    asterisk.style.display = 'none';
                }
            }
            else
            {
                asterisk.style.display = 'initial';
            }
        });
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