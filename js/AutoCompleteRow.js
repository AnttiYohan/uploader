import { deleteChildren, newTagClassHTML } from './util/elemfactory.js';
import { WCBase, props } from './WCBase.js';

/**
 * Creates an input that has an auto completion feature
 * From a list of words
 */
class AutoCompleteRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mWordList = [];

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
        .row {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .row__label--aboslute {
            width: ${props.row_label_width}; 
            font-size: ${props.small_font_size};
            font-weight: 200;
            color: #222;
            
        }
        .row__input {
            height: ${props.row_input_height};
            /*background-color: ${props.lightgrey};*/
            border: 1px solid ${props.grey};
            padding: 4px;
            border-radius: 2px;
            font-weight: 200;
            color: #222;
            box-shadow: 0 1px 13px 2px rgba(0,0,0,0.25);
        }
        .row__input:invalid {
            border: 2px solid ${props.red};
            background-image: url('assets/ic_right');
            background-repeat: no-repeat;
        }
        .row__input:focus {
            outline: none;
            border: 1px solid ${props.grey};
        }
        .row__suggestions {
            overflow-y: scroll;
            z-index: 10;
            display: none;
            flex-direction: column;
            position: absolute;
            transform: translate(129px, 32px);
            background-color: #fff;
            border-radius: 2px;
            border: 1px solid rgba(0,0,0,0.5);
            width: 200px;
            height: 96px;
        }
        .suggestion__word {
            font-size: ${props.text_font_size};
            font-weight: 200;
            font-color: #222;
        }
        `);

        this.setupTemplate
        (`<div class='row'>
            <div class='row__label'><slot></div>
            <input type='text' class='row__input'>
            <ul class='row__suggestions'>
         </div>
        `);

        // ---------------------------
        // - Grab the input
        // ---------------------------

        this.mInput = this.shadowRoot.querySelector('.row__input');
        this.mSuggestionUl = this.shadowRoot.querySelector('.row__suggestions');
        // ------------------------------
        // - Listen to the input events
        // ------------------------------

        this.mInput.addEventListener('blur', e => 
        {
            console.log(`AutoCompleteInput blur event catched`);
            //this.mSuggestionUl.style.display = 'none';
        });

        this.mInput.addEventListener('focus', e => 
        {
            const value = e.target.value;
            console.log(`AutoCompleteInput focus event catched, value: ${value}`);
            this.displayValue(value);
        });

        this.mInput.addEventListener('input', e => 
        {
            console.log(`AutoCompleteInput value: ${e.target.value}`);
            const value = e.target.value;
            this.displayValue(value);
        });

    
    }

    get value() 
    {
        return this.mInput.value;
    }

    addWord(word)
    {
        this.mWordList.push(word);
    }

    /**
     * Fill the internal wordlist
     * 
     * @param {string[]} list 
     */
    loadWords(list)
    {
        this.mWordList = [];

        for (const item of list)
        {
            this.addWord(item);
        }
    }

    /**
     * Display mathched words beneath the ingrendient input
     * 
     * @param {string} value 
     */
    displayValue(value)
    {
        const matches = [];

        /* Display all */
        if (value.length === 0)
        {
            for (const word of this.mWordList)
            {
                matches.push(word);
            }
        }
        else
        {
            for (const word of this.mWordList)
            {
                if (word.startsWith(value)) matches.push(word);
            }
        }

        if (matches.length)
        {
            this.mSuggestionUl.style.display = 'flex';
            deleteChildren(this.mSuggestionUl);
            for (const word of matches)
            {
                const 
                li = newTagClassHTML('li', 'suggestion__word', word);
                /*li.appendChild
                (

                )*/

                li.addEventListener('click', e =>
                {
                    console.log(`List item ${word} clicked`);
                    this.mInput.value = word;
                    this.sendWordChosenEvent(word);
                    this.hideSuggestions();
                });

                this.mSuggestionUl.appendChild(li);
            }
        }
        else
        {
            this.mSuggestionUl.style.display = 'none';
        }
    }

    hideSuggestions()
    {
        deleteChildren(this.mSuggestionUl);
        this.mSuggestionUl.style.display = 'none';
    }

    sendWordChosenEvent(word)
    {
        this.shadowRoot.dispatchEvent(new CustomEvent('word-chosen', { detail: word , bubbles: true, composed: true }));
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------



    connectedCallback()
    {
        console.log("<auto-complete-row> connected");
        this.shadowRoot.dispatchEvent(new CustomEvent('autocompleterow-connected', { bubbles: true, composed: true}));
    }

    disconnectedCallback()
    {
        console.log("<auto-complete-row> disconnected");
    }  
}

window.customElements.define('auto-complete-row', AutoCompleteRow );

export { AutoCompleteRow };