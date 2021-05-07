import { WCBase, props } from './WCBase.js';


/**
 * Content browser consists of a search input element
 * ans a scroll container below the search elem.
 * The scroll container is populated with the search
 * results
 * Browser emits events when an item in the container
 * is clicked/pressed on/touched
 * Browser also listens to changes in the dataset.
 * 
 * @emits   item-click
 * @listens tab
 * @listens change
 * @member  SearchInput
 * @member  ScrollContainer
 * ======================================== 
 */
class SearchInput extends WCBase
{
    constructor(args = {})
    {
        super();

        // -----------------------------------------------
        // - Introduce properties
        // -----------------------------------------------

        /**
         * List is the string dataSet
         * container
         * ---------
         * @property {string[]} mList
         */
        this.mList = [];

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component__row search'>
                <input class='search__input'>
                <p class='search__title'><slot></p>
            </div>
        `);
        
        this.setupStyle
        (`.component__row.search {
            position: relative;
         }
        .search__input {
            border-radius: 12px;
            background-color: #fff;
            background-repeat: no-repeat;
            background-size: 20px;
            background-position: right;
            background-image: url( 'assets/icon_search.svg' );
            border: 1px solid rgba(0, 0, 0, 0.25);
            box-shadow: 0 0 12px -3px rgba(0, 0, 0, 0.25); 
            width: 100%;
            min-height: 24px;
            padding: 4px;
        }
        .search__input:hover {
            border: 1px solid rgba(0, 0, 0, 0.25);
            background-color: #eee;
        }
        .search__input:focus {
            outline: 2px solid #222;
        }
        .search__input:active {
            border: 2px solid rgba(0, 0, 0, 0.5);
            min-height: 22px;
        }
        .search__title {
            position: absolute;
            top: 0px;
            left: 4px;
            color: inherit;
            font-size: 14px;
        }
        `);

       /**
        * The Text Input element where the search
        * is typed
        * @property {HTMLTextInputElement} mInput
        * @listens  input
        */
        this.mInput = this.shadowRoot.querySelector('.search__input');

        this.mInput.addEventListener
        ('input', e => 
        {
            this.emit('input', e.target.value);
        });


    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------
    get value()
    {
        return this.mInput.value;
    }

    get length()
    {
        return this.mList.length;
    }

    addItem( dataItem )
    {
        if ( dataItem === typeof'string' )
        {
            this.mList.push(dataItem);
        }
    }

    pushDataSet(dataSet)
    {
        for (const dataItem of dataSet)
        {
            this.addItem( dataItem );
        }
    }

    emit(eventType, msg)
    {
        this.shadowRoot.dispatchEvent
        (
            new CustomEvent
            (
                eventType, 
                {
                    bubbles:  true, 
                    composed: true, 
                    detail:   msg
                }
            )
        );
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<search-input> connected");
        this.emit('search-input-connected');
    }

    disconnectedCallback()
    {
        console.log("<search-input> disconnected");
    }
}
 

window.customElements.define('search-input', SearchInput);

export { SearchInput };