import { WCBase, props } from './WCBase.js';

/**
 * InputBase
 * ------------
 * Base Class for input elements, 
 * Introduces a common interface for
 * - required / notifyRequired functionality
 * - reset input functionality
 * - title
 * - value (single, array)
 * - type (of value/values: string, number, boolean)
 * - size (for value arrays)
 * 
 * ---------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class InputBase extends WCBase
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

        /** Status of input content requirement */
        this.mRequired = this.hasAttribute('required')
                       ? true
                       : false;
        
        /** Type of value/values {string} */
        this.mType = options.hasOwnProperty('type') 
                   ? options.type 
                   : 'string';

        /** Label element */
        this.mLabel = undefined;

        /** The Input Element, assign in child class */
        this.mInput = undefined;

        /** Notirfier element */
        this.mNotifier = undefined;
      
    }

    /**
     * Return input value 
     * ----------------
     * @return {string}
     */
    get value() 
    {
        return this.mInput.value;
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
        return this.mRequired;
    }

    object()
    {
        return {[this.mKey]: this.mInput.value};
    }

    /**
     * Clear the input
     */
    reset()
    {
        if (this.mType === 'number')
            this.mInput.value = 0;
        else
            this.mInput.value = '';
    }

    /**
     * Initializes the element
     * to act as the notifier by
     * observing the changed state of
     * the input value
     * @param {HTMLElement} element
     */
    initNotifier(element)
    {
        this.mNotifier = element;
    }

    /**
     * Default setup for Input and label elements,
     * NOTE: The Notifier element must be initialized beforehand!
     * 
     * @param {HTMLElement} inputElement 
     * @param {HTMLElement} labelElement 
     */
    initInputAndLabel(inputElement, labelElement)
    {
        this.mInput = inputElement;
        this.mLabel = labelElement;

        if (this.mRequired)
        {
            this.mLabel.classList.add('required');

            this.mInput.addEventListener('input', e => 
            {
                if (this.mInput.value.length)
                {
                    if (this.mNotifier.classList.contains('notify-required'))
                    {   
                        this.mNotifier.classList.remove('notify-required');
                    }

                    if (this.mLabel.classList.contains('required'))
                    {
                        this.mLabel.classList.remove('required');
                    }
                }
                else
                {
                    this.mLabel.classList.add('required');
                }
            });
        }
    }


    /**
     * Adds a class into the input, which sets a red border,
     * In order to display that the input must be filled
     */
    notifyRequired()
    {
        if (this.mRequired) this.mNotifier.classList.add('notify-required');
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        this.mTitle = this.shadowRoot.querySelector('slot');
    }
  
}

export { InputBase };