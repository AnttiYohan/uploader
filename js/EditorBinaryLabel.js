import { EditorComponent } from './EditorComponent.js';

/**
 * Text Input Row, with old value on the left
 * Side. For editors.
 * ======================================== 
 */
 class EditorBinaryLabel extends EditorComponent
 {
    constructor()
    {
        super();

         // -----------------------------------------------
         // - Setup ShadowDOM and possible local styles
         // -----------------------------------------------
 
        this.attachShadow({mode : "open"});
   
        this.setupTemplate
         (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
                <div class='component__row current'>
                    <p class='component__label'><slot></p>
                    <p class='component__value'></p>
                </div>
            </div>`);
 
         /*
         this.setupStyle
          (`.component__value {
             background-color: #fff;
             border-radius: 4px;
             border: 1px solid rgba(0,0,0,0.133);
             box-shadow: 0 3px 12px -5px rgba(0,0,0,0.25);
             width: 100%;
          }`);*/

        this.initValueElement
        (
            this.shadowRoot.querySelector('.component__value')
        );
 
    }
    
    reset()
    {
        this.mValueElement.textContent = '';
    }

    addContent( value )
    {
        if ( value )
        {
            this.mValueElement.textContent = 'Yes';
        }
        else
        {
            this.mValueElement.textContent = 'No';
        }
    }
 }

 window.customElements.define( 'editor-binary-label', EditorBinaryLabel );
 
 export { EditorBinaryLabel };