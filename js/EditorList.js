import { EditorComponent } from './EditorComponent.js';
import { deleteChildren, newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';

/**
 * Text Input Row, with old value on the left
 * Side. For editors.
 * ======================================== 
 */
 class EditorList extends EditorComponent
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

    /**
     * Returns value element's text content
     * @return {array|undefined}
     */
    get value()
    {
        const values = [];
        const rows = Array.from(this.mValueElement.children);

        for (const row of rows)
        {
            values.push(row.textContent);
        }

        return values.length ? values : undefined;
    }
     
    reset()
    {
        deleteChildren( this.mValueElement );
    }
    
    addContent( list )
    {
        for ( const item of list )
        {
            const row = newTagClassChildren(
                'div',
                'component__row',
                [
                    newTagClassHTML('p', 'component__label', item )
                ]
            );

            this.mValueElement
                .appendChild( row );
        }
    }    
}

window.customElements.define( 'editor-list', EditorList );
 
export { EditorList };