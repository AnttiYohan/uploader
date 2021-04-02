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
        // - Setup member properties
        // -----------------------------------------------

        let required = false;

        if (this.hasAttribute('required')) required = true;

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
        .row {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .row__label {
            width: ${props.row_label_width}; 
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
        }
        .row__input {
            width: 100%;
            border: 1px solid ${props.grey};
            padding: 4px;
            border-radius: 2px;
            font-weight: 200;
            color: #222;
            box-shadow: 0 1px 6px 1px rgba(0,0,0,0.1);
        }
        .row__input:focus {
            outline: none;
            border: 2px solid ${props.darkgrey};
        }
        .row__input:invalid {
            border: 2px solid ${props.red};
            background-image: url('assets/icon_exclamation_red.svg');
            background-repeat: no-repeat;
            background-position-x: right;
        }
        `);

        this.setupTemplate
        (`<div class='row'>
            <label for='<slot>'  class='row__label'><slot></label>
          </div>
          <textarea rows='8' name='<slot>' class='row__input' ${required ? 'required' : ''}>
          </textarea>`);

        // ---------------------------
        // - Grab the input
        // ---------------------------

        this.mInput = this.shadowRoot.querySelector('.row__input');
    }

    get value() 
    {
        return this.mInput.value;
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

window.customElements.define('text-input-area', TextInputArea );

export { TextInputArea };