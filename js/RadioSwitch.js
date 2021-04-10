import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class RadioSwitch extends WCBase
{
    constructor(title, state = false)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mTitle = title;

        if (this.hasAttribute('on')) state = true;

        this.mState = state;

    
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .button {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            width: auto;
            margin: 4px;
            padding: 0 4px;
            height: 32px;
            border: 2px solid ${props.darkgrey};
            border-radius: 4px;
            font: inherit;
            color: inherit;
            background-color: ${props.lightgrey};
            transition: background-color .15s, color .15s;
        }
        .button.active {
            background-color: ${props.red};
            color: #fff;
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<div class='button ${state ? "active" : ""}'>${title}</div>`);

        // ---------------------------
        // - Listen to buttons
        // ---------------------------

        this.mButton = this.shadowRoot.querySelector('.button');
        this.mButton.addEventListener
        ('click', e => 
        {
            // -------------------------------------
            // - Take action ONLY when radio switch
            // - Is not set
            // -------------------------------------

            if ( ! this.mState)
            {
                // button.classList.toggle('active');
                //this.mState = ! this.mState;
                // -------------------------------------
                // - Set the switch
                // -------------------------------------

                this.mState = true;
                this.mButton.classList.add('active');
                
                // -------------------------------------
                // - Notify the parent of a state change
                // -------------------------------------

                this.shadowRoot.dispatchEvent
                (
                    new CustomEvent('state-change', 
                    {
                        bubbles: true,
                        composed: true,
                        detail: 
                        {
                            "title": this.mTitle,
                            "state": this.mState
                        }
                    })
                );
            }
        });
    
    }

    /**
     * Sets the button state high
     */
    turnOn()
    {
        this.mState = true;
        this.mButton.classList.add('active');
    }

    /**
     * Sets the button state low
     */
    turnOff()
    {
        this.mState = false;
        this.mButton.classList.remove('active');
    }

    /**
     * Sets the button state
     * @param {boolean} value
     */
    set state(value)
    {
        this.mState = value;

        if (value)
        {
            button.classList.add('active');
        }
        else
        {
            button.classList.remove('active');
        }
    }

    /**
     * Returns the button state
     * @return this.mState
     */
    get state() 
    {
        return this.mState;
    }

    /**
     * Returns the button title
     * @return this.mTitle
     */
    get title()
    {
        return this.mTitle;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<radio-switch> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<radio-switch> disconnected");
    }  
}

window.customElements.define('radio-switch', RadioSwitch );

export { RadioSwitch };