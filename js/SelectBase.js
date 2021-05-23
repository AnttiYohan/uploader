import { WCBase, props } from './WCBase.js';

/**
 * Select base
 * ------------
 * Base Class for multi select input elements, 
 * Introduces a common interface for
 * - reset input functionality
 * - title
 * - key
 * - value (single, array)
 * - type (of value/values: string, number, boolean)
 * - size (for value arrays)
 * - object(), for request return value
 * ---------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class SelectBase extends WCBase
{
    constructor(options = {})
    {
        super();
        
        /* Input class members */
        this.mMultiSelect = options.hasOwnProperty('multiselect')
                    ? options.multiselect
                    : false; 


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
        this.mRequired = false;
        
        /*this.hasAttribute('required')
                       ? true
                       : false;*/
        
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

        // -----------------------------------------------
        // - Read the group attribute
        // -----------------------------------------------

        this.mSwitchArray   = [];
        this.mGroupList     = [];
        this.mContentAmount = 0;
        
        let gridPrefix = '';

        if (this.hasAttribute('group'))
        {
            const group  = this.getAttribute('group');
            const parsed = group ? JSON.parse(group) : undefined;

            if (Array.isArray(parsed))
            {
                this.mGroupList = parsed;
            }

            this.mContentAmount = this.mGroupList.length;

            // -----------------------------------
            // - Check the content amount oddity
            // -----------------------------------

            if (this.mContentAmount % 6 === 0)
            {
                    gridPrefix = '--12';
            }
            else
            if (this.mContentAmount % 5 === 0)
            {
                gridPrefix = '--10';
            }
        }
        else
        {
            console.log(`attribute group not found`);
        }

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        //this.setAttribute('tabIndex', '-1');
        this.attachShadow({mode : "open"});
        
        this.setupTemplate
        (
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='component'>  
           <p class='component__label'><slot></p>
           <div class='component__grid${gridPrefix}'>
           </div>
         </div>`
        );

        console.log(`.component__grid${gridPrefix}`);

        this.mContainerElement = this.shadowRoot.querySelector(`.component__grid${gridPrefix}`);
     
    }

    get stateList()
    {
        const list = [];

        for (const elem of this.mSwitchArray)
        {
            if (elem.state) list.push({name: elem.value});
        }

        return list;
    }

    /**
     * Returns the active switch value
     * ===============================
     * @return {string|array}
     */
     get value()
     {
         // ---------------------
         // - Multi state
         // ----------------------

         if ( this.mMultiSelect )
         {
            const list = this.stateList;

            return list.length ? list : undefined;
         }

         // ----------------------
         // - Single state
         // ----------------------

         let result = '';
 

         for (const elem of this.mSwitchArray)
         {
             if (elem.state) 
             {
                 result = elem.value;
                 break;
             }
         }
 
         return result;
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
        const  result = this.value;
        return result ? {[this.mKey]: result} : result;
    }

    /**
     * Clear the input
     */
    reset()
    {
        this.empty();
    }

    fill()
    {
        if (this.mMultiSelect)
        {
            console.log(`Turn on elems`);
            this.mSwitchArray.forEach(elem => elem.turnOn());
        }
    }

    empty()
    {
        this.mSwitchArray.forEach(elem => elem.turnOff());

        if ( ! this.mNull) this.mSwitchArray[0].turnOn();
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

export { SelectBase };