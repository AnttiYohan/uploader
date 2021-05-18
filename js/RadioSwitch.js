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
        this.mWidth = '100%';

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
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            word-wrap: break-word;
            max-width: ${this.mWidth};
            height: 48px;
            border: 1px solid ${props.color.dark};
            border-radius: 4px;
            color: #ffffff;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            background-color: ${props.color.light};
            font-weight: 200;
            transition: background-color .15s, color .15s;
        }
        .switch:focus,
        .switch:active {
            outline: none;
            border: 2px solid ${props.color.dark};
            height: 46px;
        }
        .switch.active {
            background-color: ${props.color.grey};
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<div tabindex='0' class='switch ${state ? "active" : ""}'>${this.mTitle}</div>`);

        // ---------------------------
        // - Listen to buttons
        // ---------------------------

        let hasFocus = false;
        
        this.mButton = this.shadowRoot.querySelector('.switch');

        const switchHandler = e => {

            // -------------------------------------
            // - Take action ONLY when radio switch
            // - Is not set
            // -------------------------------------

            if ( ! this.mState)
            {
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
        }

        this.mButton.addEventListener('focus', e => 
        {
            hasFocus = true;
        });

        this.mButton.addEventListener('blur', e => 
        {
            hasFocus = false;
        });

        this.mButton.addEventListener('click', e => switchHandler(e));

        this.shadowRoot.addEventListener('keydown', e =>
        {
            if (hasFocus && e.keyCode === this.ENTER)
            {
                switchHandler(e);
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
            this.mButton.classList.add('active');
        }
        else
        {
            this.mButton.classList.remove('active');
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

    /**
     * Returns the value when state is on
     * @return {string|null}
     */
    get value()
    {
        return this.mState ? this.mValue : null
    }

    /**
     * Return the value
     * @return {string}
     */
    getValue()
    {
        return this.mValue;
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