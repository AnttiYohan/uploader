import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class BinaryButtonRow extends WCBase
{
    constructor(state = false)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        if (this.hasAttribute('on')) state = true;

        this.mState = state;


        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`
        .clickable {
            cursor: pointer;
        }
        .zoomable {
            transition: transform .15s ease-in-out;
        }
        .zoomable:hover {
            transform: scale3D(1.1, 1.1, 1.1);
        }
        .row {
            display: grid;
            grid-template-columns: 70px 70px auto;
            width: ${props.frame_width};
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-items: center;
        }
        .row__label {
            padding-left: 8px;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            color: inherit;
        }
        .row__button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 32px;
            border: 2px solid ${props.darkgrey};
            border-radius: 4px;
            color: inherit;
            background-color: ${props.lightgrey};
            transition: background-color .15s, color .15s;
        }
        .row__button.active {
            background-color: ${props.red};
            color: #fff;
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'> 
          <div class='row__label'><slot></div>
          <div class='row'>
            <div class='row__button ${state ? "active" : ""}'>Yes</div>
            <div class='row__button ${state ? "" : "active"}'>No</div>
        </div>`);

        // ---------------------------
        // - Listen to buttons
        // ---------------------------

        const buttons = this.shadowRoot.querySelectorAll('.row__button');
        for (const button of buttons)
        {
            button.addEventListener
            ('click', e => 
            {
                for (const b of buttons) b.classList.toggle('active');
                this.mState = ! this.mState;
            });
        }
    }

    get state() 
    {
        return this.mState;
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