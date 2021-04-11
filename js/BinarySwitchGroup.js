import { WCBase, props } from './WCBase.js';
import { BinarySwitch } from './BinarySwitch.js'
/**
 * 
 */
class BinarySwitchGroup extends WCBase
{
    constructor()
    {
        super();
        

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            font-family: 'Baskerville Normal';
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .row {
            display: flex;
            flex-direction: row;
            width: ${props.frame_width};
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};     
        }
        .row__paragraph {
            font-size: ${props.text_font_size};
            font-weight: 200;
            font-color: #222;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            padding: 4px;
            justify-content: center;
            align-items: center;
            width: ${props.frame_width};
            border: 1px solid ${props.grey};
            border-radius: 4px;
        }`);

        this.setupTemplate
        (`<div class='row'>
           <p class='row__paragraph'><slot></p>
        </div>
        <div class='container'>
            <binary-switch>Breakfast</binary-switch>
            <binary-switch>Lunch</binary-switch>
            <binary-switch>Dinner</binary-switch>
            <binary-switch>Snack</binary-switch>
            <binary-switch>Dessert</binary-switch>
            <binary-switch>Appetizer</binary-switch>
            <binary-switch>Salad</binary-switch>
            <binary-switch>Soup</binary-switch>
            <binary-switch>Smoothie</binary-switch>
            <binary-switch>Beverages</binary-switch>
        </div>`);

        this.mContainerElement = this.shadowRoot.querySelector('.container');
        this.mContainerElement.addEventListener('click', e => { console.log(this.stateList); });
    }

    get stateList()
    {
        const list = [];

        for (const elem of this.mContainerElement.children)
        {
            if (elem.state) list.push({name: elem.textContent.toUpperCase()});
        }

        return list;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<binary-switch-group> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<binary-switch-group> disconnected");
    }  
}

window.customElements.define('binary-switch-group', BinarySwitchGroup );

export { BinarySwitchGroup };