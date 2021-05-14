import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class BinarySwitch extends WCBase
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
            word-wrap: break-word;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
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

        const switchHandler = e => {
        
            button.classList.toggle('active');
            this.mState = ! this.mState;
        };

        const button = this.shadowRoot.querySelector('.switch');
        button.addEventListener
        ('click', e => switchHandler(e));

        button.addEventListener('focus', e => 
        {
            hasFocus = true;
        });

        button.addEventListener('blur', e => 
        {
            hasFocus = false;
        });

        this.shadowRoot.addEventListener('keydown', e =>
        {
            if (hasFocus && e.keyCode === this.ENTER)
            {
                switchHandler(e);
            }
        });
    
    }

    get state() 
    {
        return this.mState;
    }

    get title()
    {
        return this.mTitle;
    }

    get value()
    {
        return this.mValue;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<binary-switch> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<binary-switch> disconnected");
    }  
}

window.customElements.define('binary-switch', BinarySwitch );

export { BinarySwitch };