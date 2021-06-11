import { EditorComponent } from './EditorComponent.js';
import { newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';

/**
 * Text Input Row, with old value on the left
 * Side. For editors.
 * ======================================== 
 */
 class EditorProductList extends EditorComponent
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
                </div>
                <div class='store'>
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
            this.shadowRoot.querySelector('.store')
        );
 
    }

    addContent( list )
    {
        for ( const product of list )
        {
            const row = newTagClassChildren(
                'div',
                'component__row',
                [
                    newTagClassHTML( 'div', 'component__label', product.name ),
                    newTagClassHTML( 'div', 'component__label', product.amount ),
                    newTagClassHTML( 'div', 'component__label', product.measureUnit )
                ]
            );

            this.mValueElement
                .appendChild( row );
        }
    }
}

window.customElements.define( 'editor-product-list', EditorProductList );

export { EditorProductList };