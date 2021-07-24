import { EditorComponent } from './EditorComponent.js';
import { deleteChildren, newTagClassAttrsChildren, newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';

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
 
         
         this.setupStyle
          (`
            .component__label { margin-right: 12px; }
            .component__label.label--header { flex-basis: 200px; }
           `);

        this.initValueElement
        (
            this.shadowRoot.querySelector('.store')
        );
 
    }

    /**
     * Returns the value of the saved product list
     */
    get value()
    {
        const list = [];

        for ( const row of this.mValueElement.children )
        {
            const name            = row.dataset.name;
            const amount          = row.dataset.amount;
            const measureUnit     = row.dataset.measureUnit;
            const productCategory = row.dataset.productCategory;
            const systemProductId = row.dataset.systemProductId;
            
            list.push({

                name,
                amount,
                measureUnit,
                productCategory,
                systemProductId

            });
        }

        return list.length ? list : undefined;
    }

    reset()
    {
        deleteChildren( this.mValueElement );
    }
    
    addContent( list )
    {
        for ( const product of list )
        {
            const attrs =
            {
                'data-name':              product.name,
                'data-product-category':  product.productCategory,
                'data-system-product-id': product.systemProductId,
                'data-amount':            product.amount,
                'data-measure-unit':      product.measureUnit
            };
            const row = newTagClassAttrsChildren(
                'div',
                'component__row',
                attrs,
                [
                    newTagClassHTML( 'div', 'component__label label--header', product.name ),
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