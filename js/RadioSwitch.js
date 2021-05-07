import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class RadioSwitch extends WCBase
{
    constructor(blob, state = false)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mTitle = blob.title;
        this.mValue = blob.value;
        this.mWidth = '80px';

        if ('width' in blob) this.mWidth = blob.width;

        if (this.hasAttribute('on')) state = true;

        this.mState = state;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`.switch {
            cursor: pointer;
            word-wrap: break-word;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            max-width: ${this.mWidth};
            height: 32px;
            border: 1px solid ${props.color.dark};
            border-radius: 4px;
            color: #ffffff;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            background-color: ${props.color.light};
            font-size: 12px;
            font-weight: 200;
            text-shadow: 0 0 4px #000;
            transition: background-color .15s, color .15s;
        }
        .switch.active {
            background-color: ${props.color.grey};
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<div class='switch ${state ? "active" : ""}'>${this.mTitle}</div>`);

        // ---------------------------
        // - Listen to buttons
        // ---------------------------

        this.mButton = this.shadowRoot.querySelector('.switch');
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

    reset()
    {
        this.turnOff();
    }

    /**
     * Sets the button state
     * @param {boolean} value
     */
    set state(val)
    {
        this.mState = val;

        if (val)
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
     * Returns the button title string
     * @return {string}
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