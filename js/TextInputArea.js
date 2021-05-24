import { InputBase } from './InputBase.js';

/**
 * Text input area, big brother of text input row
 */
class TextInputArea extends InputBase
{
    constructor()
    {
        super({type: 'string'});
        
        const rows = this.hasAttribute('rows') ? this.getAttribute('rows') : 8;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
                <p class='component__label'><slot></p>
            </div>
            <div class='component__row'>
                <textarea rows='${rows}' class='component__input'></textarea>
            </div>
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

window.customElements.define('text-input-area', TextInputArea );

export { TextInputArea };