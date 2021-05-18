import { WCBase, props } from './WCBase.js';
import { ScrollContainer } from './ScrollContainer.js';
import { deleteChildren, newTagClassChildren, newTagClassAttrsChildren, newTagClassHTML, newTagClassAttrs } from './util/elemfactory.js';

/**
 * Creates ingredient from system products
 * Content browser extension
 * 
 * @emits   content-header-click
 * @member  ScrollContainer
 * ======================================== 
 */
class IngredientMenu extends WCBase
{
    constructor()
    {
        super();

        /**
         * List is the string dataSet
         * container
         * ---------
         * @property {string[]} mList
         */
         this.mList = [];

        /**
         * List content tagging
         */
        this.mTag = (this.hasAttribute('data-list') && 
                     this.getAttribute('data-list') === 'tag')
                     ? true
                     : false;

        const actions = [];
        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
              <p class='component__label'><slot></p>
              <div class='content__list'></div>
              <input class='search__input' type='text'>
              <scroll-container class='container'></scroll-container>
            </div>
        `);
        
        this.setupStyle
         (`.component {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 200px;
            border-radius: 8px;
            border: 2px solid transparent;
            box-shadow: 0 0 12px -5px rgba(0, 0, 0, 0.25);    
            background-color: #fff;
         }
        ::host {
            border-radius: 4px;
            border: 2px solid transparent;
        }
        .component:focus {
            outline: 2px solid #222;
        }
        .component.active {
            border: 2px solid rgba(0, 0, 0, 0.5);
        }
        .content__list {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100px;
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            box-shadow: 0 0 12px -5px rgba(0, 0, 0, 0.25);    
            background-color: #fff;
            overflow-y: scroll;
         }
        /*.content__list .listed {
            cursor: pointer;
        }
        .content__list .listed:hover {
            background-color: #eee;
        }*/
        .component__row.listed {
            cursor: pointer;
            justify-content: space-between;
        }
        .component__row .tag {
            width: 32px;
            padding: 6px;
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
            /*outline: 2px solid #222;*/
        }
        .search__input:active {
            /*border: 2px solid rgba(0, 0, 0, 0.5);
            min-height: 22px;*/
        }
        `);

        const componentFrame = this.shadowRoot.querySelector('.component');
        
 /**
         * The Content list
         * @member {HTMLDivElement} mContentList
         * -------
         */
         this.mContentList = this.shadowRoot.querySelector('.content__list');


        /**
         * The search input
         * @member {HTMLTextInputElement} mInput
         * -------
         */
        this.mInput = this.shadowRoot.querySelector('.search__input');

        /**
         * The scroll container widget
         * @member {ScrollContainer} mScrollContainer
         * -------
         */
        this.mScrollContainer = this.shadowRoot.querySelector('.container');

        /**
         * @listen input events from search input
         */
        this.mInput.addEventListener('input', e => 
        {
            const input = e.target.value;
            let matches = [];

            if (input.length)
            {
                matches = this.findMatches(input);
            }
            else
            {
                this.mScrollContainer.blur();
            }

            if (matches.length)
            {
                this.mScrollContainer.pushContentAsStrings(matches, actions);
                this.mScrollContainer.blur();
            }
            else
            {
                this.mScrollContainer.clear();
            }

        }, true);

        /**
         * @listen keyboard tab and keyup/down events
         */
         this.shadowRoot.addEventListener('keydown', e => 
         {
            const key = e.keyCode;

            switch( key )
            {
                case this.KEYDOWN :
                {
                    this.mScrollContainer.down();
                    break;
                }
                case this.KEYUP :
                {
                    this.mScrollContainer.up();
                    break;
                }
                case this.ENTER :
                {
                    this.emitContent();   
                    break;
                }
            }
         });

        this.addEventListener('focus', e => 
        {
            const target = e.target;
            e.stopPropagation();

            componentFrame.classList.add('active');
        }, true);

        this.shadowRoot.addEventListener('blur', e =>
        {
            const target = e.target;
            e.stopPropagation();

            componentFrame.classList.remove('active');
            
        }, true);
    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------

    /**
     * Returns the current dataSet size
     * as amount of entries (entry contains one string)
     * --------------------
     * @return {number}
     */
    get size()
    {
        return this.mList.length;
    }

    /**
     * Returns the current amount of matching
     * entries in the scroll container
     * -------------------------------
     * @return {number}
     */
    get matchCount()
    {
        return this.mScrollContainer.count();
    }

    emitListed(title)
    {
        console.log(`IngredientMenu: emit listed ${title}`);

        if (typeof title !== 'string' || title.length === 0) return;

        try {
         
            console.log(`IngredientMenu: emitting list product with: ${title}`);

            this.parentElement.connectFromHost(title);
            
        } catch (error) {

            console.log(`ContentBrowser::emitListed(${title}): ${error}`);

        }
    }

    emitContent()
    {
        const value = this.mScrollContainer.valueAtIndex;

        console.log(`IngredientMenu::emitContent value: ${value}`);

        if ( ! value ) return;

        console.log(`IngredientMenu: emitting product-select with: ${value}`);
        this.addToList(value);
        
        try {
                this.parentElement.connectFromHost(value);
        } catch (error) {
            console.log(`IngredientMenu::emitListed(${value}): ${error}`);
        }

    }

    createListItem(title, options = {})
    {
        const fields = [
            newTagClassHTML
            (
                'p',
                'component__label',
                title
            )
        ];

        if (this.mTag)
        {
            fields.push(

                newTagClassAttrs(
                    'input',
                    'tag',
                    {
                        type: 'checkbox'
                    }
                )

            );
        }

        const headingRow = newTagClassAttrsChildren
        (
            'div',
            'component__row listed',
            { 'data-title': title },
            fields
        );

        headingRow.addEventListener('click', e => 
        {
            this.emitListed(title);
            console.log(`IngredientMenu listed: ${e.target.dataset}, ${title}`);
        });

        return headingRow;
    }

    addToList(item)
    {
        this.mContentList.appendChild(this.createListItem(item));
    }

    populateContentList(list)
    {
        let len = list.length;
        if (len > 5) len = 5;

        deleteChildren(this.mContentList);

        for (let i = 0; i < len; i++)
        {    
            this.mContentList.appendChild(headingRow);
        }
    }

    /**
     * Adds a string into the content array
     * ------------------------------------
     * @param {string} dataItem 
     */
    addItem( dataItem )
    {
        if ( typeof(  dataItem) === 'string' )
        {
            this.mList.push( dataItem );

            if (this.mContentList.children.length < 5) 
            {
                this.addToList( dataItem );
            }
        }
    }

    /**
     * Loads an array of strings as content
     * for the browser
     * ---------------
     * @param {Array<string>} dataSet 
     */
    pushDataSet( dataSet )
    {
        this.mList = [];

        for ( const dataItem of dataSet )
        {
            this.addItem( dataItem );
        }
    }

    /**
     * Compares the param string with every entry in
     * the dataset, match is considered valid, when
     * an entry starts with the 'needle',
     * I. e. entry 'honey' MATCH 'h'..'honey'
     * Returns every matching entry
     * ----------------------------
     * @param  {string}   needle 
     * @return {Array<string>}
     */
    findMatches(needle)
    {
        return this.mList.filter(

            entry => entry.toLowerCase().startsWith(needle)
        
        );
    }

    createTestSet()
    {

        const testSet =
        [
            'avocado',
            'banana',
            'blackpepper',
            'cashew nuts',
            'cinnamon (East Indian)',
            'cocoa powder (organic)',
            'coconut oil',
            'corn flour',
            'cream',
            'durum wheat',
            'ghee',
            'honey (organic)',
            'lard',
            'milk',
            'mint (dried)',
            'mustard (hot)',
            'peas',
            'peas (dried)',
            'pepper',
            'pork ribs',
            'pork loins',
            'rice (jasmin organic)',
            'rice (organic)',
            'salt',
            'taco bread',
            'tomato',
            'tuna',
            'wheat flour',
            'whitepepper',
            'xylitol'
        ];

        //this.populateContentList(testSet);

        this.pushDataSet(testSet);

        console.log(`ContentBrowser: Used ${testSet.length} strings to create a test dataset. Dataset size: ${this.size} entries`);

        const needles = ['ban', 'cr', 'pe'];
        console.log(`Let's test match finding. We'll use three different strings to match entries with: ${needles.join(', ')}`);

        for (const needle of needles)
        {
            console.log(`ContentBrowser::test - matching entries with "${needle}"...`);

            const matches = this.findMatches(needle);

            if (matches.length) console.log(`"${needle}" matched with [ ${matches.join(', ')} ]`);
            else console.log(`"${needle}" did not create a single match`);
        }

        console.log(`ContentBrowser: dataset test done: creation, measuring, matching.`);

    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<ingredient-menu> connected");
        this.shadowRoot.addEventListener('content-header-click', e =>
        {
            const title = e.detail.title;

            e.preventDefault();
            e.stopPropagation();
            console.log(`ContentBrowser: ${title} item click received`);

            if (typeof title === 'string' && title.length)
            {
                this.emitListed(title);
            }
            
        }, true);
    }

    disconnectedCallback()
    {
        console.log("<ingredient-menu> disconnected");
    }
}
 

window.customElements.define('ingredient-menu', IngredientMenu );

export { IngredientMenu };