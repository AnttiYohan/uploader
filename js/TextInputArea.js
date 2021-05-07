import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class TextInputArea extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Read attributes
        // -----------------------------------------------

        const required = this.hasAttribute('required') ? true : false;

        const rows = this.hasAttribute('rows') ? this.getAttribute('rows') : 8;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
                <p class='component__label${required ? " required" : ""}'><slot></p>
            </div>
            <div class='component__row'>
                <textarea rows='${rows}' class='component__input'>
                </textarea>
            </div>
          </div>`);

        // ---------------------------
        // - Grab the input
        // ---------------------------

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
        console.log("<text-input-area> connected");
        this.mInput.value = '';
    }

    disconnectedCallback()
    {
        console.log("<text-input-area> disconnected");
    }  
}

window.customElements.define('text-input-area', TextInputArea );

export { TextInputArea };