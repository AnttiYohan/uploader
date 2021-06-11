import { WCBase } from './WCBase.js';
import { TextInputRow } from './TextInputRow.js';

/**
 * Text Input Row, with old value on the left
 * Side. For editors.
 * ======================================== 
 */
 class EditorTextInput extends WCBase
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
           <div class='frame'>
             <div class='component'>
               <div class='component__row'>
                 <p class='component__label'><slot></p>
                 <p class='component__value'></p>
               </div>
             <div>
             <text-input-row data-input='<slot>'></text-input-row>
           </div>`);
 
         
         this.setupStyle
          (`.frame {
            display: flex;
          }`);

        this.mValueElement = this.shadowRoot.querySelector('.component__value'); 
        this.mInputElement = this.shadowRoot.querySelector('[data-input]')
 
     }
 
     // ----------------------------------------------
     // - Methods
     // ----------------------------------------------
 
    get value()
    {
        return this.mInputElement.value;
    }
 
     /**
      * Return required status
      * ---------------
      * @return {boolean}
      */
     get required()
     {
         return false;
     }
 
    object()
    {
        this.mInputElement.object();
    }
 
     reset()
     {
        this.mInputElement.reset();
     }
     
     // ----------------------------------------------
     // - Lifecycle callbacks
     // ----------------------------------------------
     connectedCallback()
     {
     }
 
     disconnectedCallback()
     {
     }
 }
  
 window.customElements.define( 'editor-text-input', EditorTextInput );
 
 export { EditorTextInput };