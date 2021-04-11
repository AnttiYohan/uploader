import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class NumberInputRow extends WCBase
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

        const invalid_state = `.row__input:invalid {
            border: 2px solid ${props.red};
            background-image: url('assets/icon_circle_up.svg');
        }`;

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`
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
            height: ${props.row_input_height};
            border: 1px solid ${props.grey};
            padding: 4px;
            border-radius: 2px;
            font-weight: 200;
            color: #222;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,0.5);
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
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='row'>
            <div class='row__label'><slot></div>
            <input type='number' class='row__input' min='1' ${required ? "value='0'" : ""}>
          </div>`);

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
        console.log("<number-input-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<number-input-row> disconnected");
    }  
}

window.customElements.define('number-input-row', NumberInputRow );

export { NumberInputRow };