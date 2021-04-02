import { WCBase, props, MEASURE_UNIT_ENUM } from './WCBase.js';
import { AutoCompleteRow } from './AutoCompleteRow.js'
import { newTagClass, newTagClassChildren, newTagClassHTML, numberInputClassValue, selectClassIdOptionList } from './util/elemfactory.js';
/**
 * 
 */
class ProductList extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :host {
            border: 1px solid ${props.grey};
            border-radius: 8px;
            padding: 8px;
            margin: 16px 0;
        }
        .list {
            display: flex;
            flex-direction: column;
        }
        .list__ingredient{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-end;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
        }
        .list__ingredient:last-of-type {
            border-bottom-width: 0px;
            height: auto;
            padding-bottom: 16px;
        }
        .ingredient__label {
            width: ${props.row_label_width};
            background: rgba(255,255,255,0.95);
            border-radius: 2px;
            border-bottom: 1px solid rgba(0,0,0,0.5);
            font-size: ${props.text_font_size};
            font-weight: inherit;
            color: #222;
            align-self: center;
        }
        .ingredient__amount {
            max-width: 48px;
            padding-left: 8px;
            font-size: ${props.text_font_size};
            font-weight: inherit;
            color: inherit
            align-self: center;
            vertical-align: center;
            height: ${props.row_input_height};
            border: 1px solid #e2e0e0;
        }
        .ingredient__unit {
            font-size: ${props.text_font_size};
            font-weight: inherit;
            color: inherit
            align-self: center;
            vertical-align: center;
            height: ${props.row_input_height};
            border: 1px solid #e2e0e0;
        }
        .ingredient__amount:active,
        .imgrendient__unit:active {
            border-color: #656565;
        }
        .ingredient__amount:invalid,
        .ingredient__unit:invalid {
            
            color: #ed1f1f;
            background-color: rgba(#ec4c4c, 0.22);
            border-color: rgba(#dc4949, 0.45);
        }
        .ingredient__button {
            width: 32px;
            height: 32px;
            align-self: center;
            justify-self: center:
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            background-color: ${props.red};
            background-image: url('assets/icon_cancel.svg');
            background-repeat: no-repeat;
        }
        `);

        this.setupTemplate
        (`<auto-complete-row class='ingredient_input'>Ingredient</auto-complete-row>
        <ul class='list'>
        </ul>`);


        // ---------------------------
        // - Setup root element style
        // ---------------------------

        // ---------------------------
        // - Grab the input
        // ---------------------------

        this.mInput = this.shadowRoot.querySelector('.ingredient_input');
        this.mList  = this.shadowRoot.querySelector('.list');

        this.mInput.loadWords
        ([
            'apple',
            'pear',
            'ground beef 7%',
            'ground beef 10%',
            'potato',
            'coconut',
            'banana',
            'sugar',
            'salt'
        ]);

        this.shadowRoot.addEventListener('word-chosen', e => 
        {
            const word = e.detail;
            console.log(`word-chosen event catched, detail: ${word}`);
            
            if ( ! this.productExists(word)) 
            {
                this.addToList(word);
            }
            
        });
    }


    loadWords(list)
    {
        //this.mInput.loadWords(list);
    }
    /**
     * Returns the autocomplete input's text value
     * 
     * @return {string}
     */
    get value() 
    {
        return this.mInput.value;
    }

    /**
     * Returns the products in the visible list
     * 
     * @return {string[]}
     */
    get chosenProducts()
    {
        const list = [];

        for (const item of this.mList.children)
        {
            const label = item.querySelector('.ingredient__label');

            if (label)
            {
                const text = label.textContent;
                if (text && text.length) list.push(text);
            }
        }

        return list;
    }

    /**
     * Returns the truth value if the input exists in the
     * product list
     * 
     * @param  {string}  word
     * @return {boolean}
     */
    productExists(word)
    {
        let result = false;

        for (const item of this.mList.children)
        {
            const label = item.querySelector('.ingredient__label');

            if (label)
            {
                const text = label.textContent;
                if (text && text === word)
                {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Adds a unique word to the list
     * 
     * @param {string} word 
     */
    addToList(word)
    {
        const label = newTagClassHTML
        (
            'label',
            'ingredient__label',
            word
        );

        const amount = numberInputClassValue
        (
            'ingredient__amount',
            1
        );

        const unit = selectClassIdOptionList
        (
            'ingredient__unit',
            'unit_selector',
            MEASURE_UNIT_ENUM
        );

        const button = newTagClass
        (
            'button',
            'ingredient__button'
        );

        const li = newTagClassChildren
        (
            'li',
            'list__ingredient',
            [
                label,
                amount,
                unit,
                button
            ]
        );

        button.addEventListener('click', e => { li.remove(); });

        this.mList.appendChild(li);
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<product-list> connected");
    }

    disconnectedCallback()
    {
        console.log("<product-list> disconnected");
    }  
}

window.customElements.define('product-list', ProductList );

export { ProductList };