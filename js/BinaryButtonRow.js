import { InputBase } from './InputBase.js';
import { props } from './WCBase.js';

/**
 * 
 */
class BinaryButtonRow extends BinaryBase
{
    constructor(state = false)
    {
        super({state});
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        if (this.hasAttribute('on')) state = true;

        this.mState = state;

        this.mIsBlocked = false;

        if (this.hasAttribute('blocked')) this.mIsBlocked = true;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`
        .binary__button {
            ${this.mIsBlocked ? "" : "cursor: pointer;"}
            display: flex;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 32px;
            border: 1px solid ${props.color.dark};
            border-radius: 4px;
            color: #ffffff;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            background-color: ${props.color.light};
            font-weight: 200;
            transition: background-color .15s, color .15s;
        }
        .binary__button:first-of-type {
            margin-right: 4px;
        }
        .binary__button.active {
            background-color: ${props.color.grey};
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__label'><slot></div>
            <div class='component__row'>
              <div class='binary__button yes ${state ? "active" : ""}'>Yes</div>
              <div class='binary__button no ${state ? "" : "active"}'>No</div>
            </div>
          </div>`);

        // ---------------------------
        // - Listen to buttons
        // ---------------------------

        const buttons = this.shadowRoot.querySelectorAll('.binary__button');
        for (const button of buttons)
        {
            button.addEventListener
            ('click', e => 
            {
                if ( ! this.mIsBlocked)
                {
                    for (const b of buttons) b.classList.toggle('active');
                    this.mState = ! this.mState;
                    this.shadowRoot.dispatchEvent
                    (
                        new CustomEvent('state', { bubbles: true, composed: true, detail: this.mState})
                    );
                }
            });
        }
    }

    /**
     * Returns the BinaryButtonRow state
     * =================================
     * @return {Boolean}
     */
    get value() 
    {
        return this.mState;
    }

    /**
     * Returns the BinaryButtonRow state
     * =================================
     * @return {Boolean}
     */
     get state() 
     {
         return this.mState;
     }

    /**
     * Set the internal blocking flag on
     */
    block()
    {
        this.mIsBlocked = true;
    }

    /**
     * Set the internal blocking flag off
     */
     unblock()
     {
         this.mIsBlocked = false;
     }



    /**
     * Sets the button state on
     */
    turnOn()
    {
        this.mState = true;
        
        const yesButton = this.shadowRoot.querySelector('.binary__button.yes');
        const noButton  = this.shadowRoot.querySelector('.binary__button.no');

        yesButton.classList.add('active');
        noButton.classList.remove('active');
    }

    /**
     * Sets the button state off
     */
     turnOff()
     {
         this.mState = false;
         
         const yesButton = this.shadowRoot.querySelector('.binary__button.yes');
         const noButton  = this.shadowRoot.querySelector('.binary__button.no');
 
         yesButton.classList.remove('active');
         noButton.classList.add('active');
     }

     reset()
     {
         this.turnOff();
     }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<binary-button-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<binary-button-row> disconnected");
    }  
}

window.customElements.define('binary-button-row', BinaryButtonRow );

export { BinaryButtonRow };