import { InputBase } from './InputBase.js';

/**
 * TextInputRow
 * ------------
 * This WebComponent is a text input, with a title
 * When 'required' attribute is set, the element
 * will display an red asterisk when left empty
 * --------------------------------------------
 * 
 */
class TextInputRow extends InputBase
{
    constructor()
    {
        super({type: 'string'});
        
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
            <input type='text' class='component__input'>
          </div>`);

        // -----------------------------------------------------
        // - Grab the input and the required asterisk div
        // -----------------------------------------------------

        const input = this.shadowRoot.querySelector('.component__input');
        const label = this.shadowRoot.querySelector('.component__label');
        
        this.initNotifier(input);
        this.initInputAndLabel(input, label);
    }
  
}

window.customElements.define('text-input-row', TextInputRow );

export { TextInputRow };