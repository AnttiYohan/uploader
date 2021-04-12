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
        this.mMatchList = [];
        this.mMatches = 0;
        this.mSelectedIndex = 0;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`
        * {
            margin: 0;
            padding: 0;
            font-family: 'Baskerville Normal';
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
            box-shadow: 0 1px 6px 1px rgba(0,0,0,0.1);
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
            padding: 0;
            list-style-type: none;
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
        .suggestion__frame {

        }
        .suggestion__word {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
        }
        .suggestion__word.selected {
            background-color: ${props.darkgrey};
            color: #fff;
        }
        `);

        this.setupTemplate
        (`<div class='row'>
            <div class='row__label'><slot></div>
            <input type='text' class='row__input'>
            <ul class='row__suggestions'>
          </div>`);

        
        this.mHeight = 94;

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

        this.shadowRoot.addEventListener('keydown', e => 
        {
            const key = e.keyCode;
            console.log(`AutoCompleteRow keypress: ${key}`);
            if (this.mSuggestionUl.style.display === 'flex' && this.mWordList.length)
            {
                if (key === this.KEYDOWN)
                {
                    //if (this.mSelectedIndex < this.mWordList.length)
                    if (this.mSelectedIndex < this.mMatches)
                    {
                        this.mSelectedIndex++;
                    }
                    else
                    {
                        this.mSelectedIndex = 1;
                    }
                    console.log(`Set selected word: ${this.mSelectedIndex}`);
                    this.setSelectedWord(this.mSelectedIndex);
                }                
                else if (key === this.KEYUP)
                {
                    if (this.mSelectedIndex > 1)
                    {
                        this.mSelectedIndex--;
                    }
                    else
                    {
                        this.mSelectedIndex = this.mMatches; //this.mWordList.length;
                    }
                    console.log(`KEYUP: ${this.mSelectedIndex}`);
                    this.setSelectedWord(this.mSelectedIndex);                    
                }
                else if (key === this.ENTER)
                {
                    console.log(`Key enter`);
                    if (this.mSelectedIndex && this.mMatches)
                    {
                        const word = this.mMatchList[this.mSelectedIndex - 1];
                        console.log(`List item ${word} ENTERED`);
                        this.mInput.value = '';
                        this.sendWordChosenEvent(word);
                        this.hideSuggestions();   
                    }
                }
            }
            //    this.mInput.value += e.keyCode;
        });    
    }

    get value() 
    {
        return this.mInput.value;
    }

    addWord(word)
    {
        let exctracted = '';
        if (typeof(word) === 'string')
        {
            exctracted = word;
        }
        else
        {
            exctracted = word.name;
        }

        this.mWordList.push(exctracted);
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
            this.mMatches = matches.length;
            this.mSuggestionUl.style.display = 'flex';
            deleteChildren(this.mSuggestionUl);
            let index = 0;

            this.mMatchList = matches;

            for (const word of matches)
            {
                index++;
                const selected = index === this.mSelectedIndex ? ' selected' : '';

                const li = newTagClassHTML('li', `suggestion__word${selected}`, word);
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

            const height = this.mSuggestionUl.clientHeight;
            this.mHeight = height;
            console.log(`UL height: ${height}`);
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

    setSelectedWord(vtPosition)
    {
        let index = 0;
        console.log(`Set selected word() loop amt: ${this.mSuggestionUl.children.length}`);
        for (const li of this.mSuggestionUl.children)
        {
            index++;
            if (index === this.mSelectedIndex)
            {
                console.log(`Add class to ${index}`);
                li.classList.add('selected');

                const clientHeight = li.clientHeight;
                const scrollHeight = li.scrollHeight;
                const lowerBound = clientHeight * index;
                //if (lowerBound > this.mHeight) li.scrollIntoView();
                li.scrollIntoView();
                console.log(`Client height: ${clientHeight}, scrollHeight: ${scrollHeight}`);
                console.log(`Lower bound in list: ${clientHeight*index}`);
            }
            else
            {
                if (li.classList.contains('selected'))
                {
                    li.classList.remove('selected');
                }
            }
            
        }
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