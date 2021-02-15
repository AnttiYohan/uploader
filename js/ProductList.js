import { WCBase, props } from './WCBase.js';
import { AutoCompleteRow } from './AutoCompleteRow.js'
import { newTagClass, newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';
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
        .list {
            display: flex;
            flex-direction: column;
        }
        .list__ingredient {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
        }
        .ingredient__label {
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            align-self: center;
        }
        .ingredient__button {
            width: 32px;
            height: 32px;
            align-self: center;
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
        // - Grab the input
        // ---------------------------

        this.mInput = this.shadowRoot.querySelector('.ingredient_input');
        this.mList  = this.shadowRoot.querySelector('.list');

        this.mInput.loadWords
        ([
            'beef',
            'potato',
            'coconut',
            'banana',
            'sugar',
            'salt'
        ]);

        this.shadowRoot.addEventListener('word-chosen', e => 
        {
            console.log(`word-chosen event catched, detail: ${e.detail}`);
            if (e.detail.length)
            {
                this.addToList(e.detail);
            }
        });
    }

    get value() 
    {
        return this.mInput.value;
    }

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

    addToList(word)
    {
        const label = newTagClassHTML
        (
            'label',
            'ingredient__label',
            word
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