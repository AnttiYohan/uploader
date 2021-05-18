import { WCBase } from './WCBase.js';

/**
 * BinaryBase
 * ------------
 * Base Class for binary state (input) elements, 
 * Introduces a common interface for
 * - reset state functionality
 * - title
 * - key
 * - value (state)
 * 
 * ---------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class BinaryBase extends WCBase
{
    constructor(options = {})
    {
        super();
        
        /* Input class members */

        /** Visible title */
        this.mTitle = options.hasOwnProperty('title')
                    ? options.title
                    : '';

        /** Unique string as key for HTTP Request */
        this.mKey   = options.hasOwnProperty('data-input')
                    ? options.dataInput
                    : this.hasAttribute('data-input')
                        ? this.getAttribute('data-input')
                        : this.mTitle;

        this.mState = options.hasOwnProperty('state')
                    ? options.state
                    : false;
        
        /** Type of value/values {string} */
        this.mType = 'boolean';
      
    }

    /**
     * Return the state
     * ------
     * @return {boolean}
     */
    get value()
    {
        return this.mState;
    }

    /**
     * Return title property
     * -------------
     * @return {string}
     */
    get title()
    {
        return this.mTitle;
    }

    /**
     * Return the type
     * ---------------
     * @return {string}
     */
    get type()
    {
        return this.mType;
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
        return {[this.mKey]: this.mState};
    }

    /**
     * method stub
     */
     notifyRequired(ensure = true) 
     {
         return '';
     }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        this.mTitle = this.shadowRoot.querySelector('slot');
    }
  
}

export { BinaryBase };