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
            grid-template-columns; auto 70px 70px;
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
            font: inherit;
            color: inherit;
        }
        .row__button {
            width: 64px;
            height: 32px;
            border: 1.5px solid ${props.darkgrey};
            font: inherit;
            color: inherit;
            background-color: ${props.lightgrey};
            transition: background-color .15s, color .15s;
        }
        .row__button .active {
            background-color: ${props.red};
            color: #fff;
            font-weight: 400;
        }`);

        this.setupTemplate
        (`<div class='row'>
            <div class='row__button ${state ? "active" : ""}'>Yes</div>
            <div class='row__button ${state ? "" : "active"}'>No</div>
            <div class='row__label'><slot></div>
        </div>`);

        // ---------------------------
        // - Save element references
        // ---------------------------

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