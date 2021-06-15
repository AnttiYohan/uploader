import { WCBase } from './WCBase.js';

/**
 * Base class for editor components.
 * Contains the connect notification,
 * And content setup subroutines,
 * That every editor component uses
 * ======================================== 
 */
 class EditorComponent extends WCBase
 {
    constructor()
    {
        super();

        /**
         * Component's value containing
         * Element
         */
        this.mValueElement;

    }

    initValueElement( element )
    {
        this.mValueElement = element;
    }

    /**
     * Returns value element's text content
     * @return {string}
     */
    get value()
    {
         return this.mValueElement.textContent;
    }
   
    reset()
    {
        this.mValueElement.textContent = '';
    }
    
   /**
    * Sets text content into value element 
    * ----
    * @param {string} text 
    */
    addContent( text )
    {
         this.mValueElement.textContent = text;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        const label = this.dataset.label;
        console.log(`EditorComponent connected, label: ${label}`);
        /**
         * Notify the editor to add
         * content to the component
         */
        this.emit( 'component-connected' , { label } );
    }
 
    disconnectedCallback()
    {
    }

}

export { EditorComponent };
