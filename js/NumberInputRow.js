import { InputBase } from './InputBase.js';

/**
 * NumberInputRow
 * ------------
 * This WebComponent is a number input,
 * with a title on the top, and a paragraph
 * at the right - a unit may be displayed there
 * When 'required' attribute is set, and the input
 * is empty/zero, the element
 * will display an red asterisk at the right hand
 * of the title
 * --------------------------------------------
 * Attributes:
 * - require : boolean
 * - unit    : string
 */
class NumberInputRow extends InputBase
{
    constructor()
    {
        super({type: 'number'});
        
        let unit = '';

        if (this.hasAttribute('unit')) unit = this.getAttribute('unit');

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='component'>
            <div class='component__row'>
            <div class='component__label'><slot></div>
            </div>
            <div class='component__row'> 
            <input type='number' class='component__input type--number'>
            <p class='component__unit'>${unit}</p>
            </div>
        </div>`);

        // ---------------------------
        // - Grab the Title label and 
        // - the number input elements
        // ---------------------------

        const input = this.shadowRoot.querySelector('.component__input');
        const label = this.shadowRoot.querySelector('.component__label');

        this.initNotifier(input);
        this.initInputAndLabel(input, label);

    }
  
}

window.customElements.define('number-input-row', NumberInputRow );

export { NumberInputRow };