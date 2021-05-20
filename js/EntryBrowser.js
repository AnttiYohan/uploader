import { WCBase, props } from './WCBase.js';
import { ScrollContainer } from './ScrollContainer.js';
import { deleteChildren, newTagClassChildren, newTagClassAttrsChildren, newTagClassHTML, newTagClassAttrs } from './util/elemfactory.js';
import { EntryHeader } from './EntryHeader.js';

/**
 * Product and Recipe entry container,
 * extesion of content browser
 * 
 * @emits   content-header-click
 * @listens tab
 * @listens change
 * @member  SearchInput
 * @member  ScrollContainer
 * ======================================== 
 */
class EntryBrowser extends WCBase
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
         * List is the string dataSet
         * container
         * ---------
         * @property {object} mPropertyList
         */
                  this.mPropertyList = [];

        /**
         * List content tagging
         */
        this.mTag = (this.hasAttribute('data-list') && 
                     this.getAttribute('data-list') === 'tag')
                     ? true
                     : false;
        
        /**
         * List actions
         **/
        const group  = this.getAttribute('data-actions');
        const parsed = group ? JSON.parse(group) : undefined;

        this.mActionList = Array.isArray(parsed) ? parsed : [];

        let type = 'default';
        if (this.mActionList.length) type = this.mActionList[0];

        const actionObject = 
        {
            type,
            'detail': `works from n3`,
            'iconUrl': 'assets/icon_edit.svg'
        };

        const actions = [];
        actions.push(actionObject);
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
                const entryList = this.createEntryHeaders(matches);
                this.mScrollContainer.pushContent(entryList);
                //this.mScrollContainer.pushContentAsStrings(matches, actions);
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
            console.log(`Focus event from ${target}, ${target.localName}.${target.className}`);
            e.stopPropagation();

            componentFrame.classList.add('active');
        }, true);

        this.shadowRoot.addEventListener('blur', e =>
        {
            const target = e.target;
            console.log(`Blur event from ${target}, ${target.localName}.${target.className}`);
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

    createEntryHeaders(list)
    {
        const result = [];

        for (const item of list)
        {
            const options = this.getOptions(item);
            result.push( new EntryHeader(options) );
        }

        return result;
    }

    emitListed(title)
    {
        if (typeof title !== 'string' || title.length === 0) return;

        try {
         
            if (this.dataset.hasOwnProperty('connect') && this.dataset.connect === 'host')
            {
                this.parentElement.connectFromHost(title);
            }
            
        } catch (error) {

            console.log(`ContentBrowser::emitListed(${title}): ${error}`);

        }
    }

    emitContent()
    {
        const value = this.mScrollContainer.valueAtIndex;

        console.log(`ContentBrowser::emitContent value: ${value}`);

        if ( ! value ) return;

        console.log(`ContentBrowser: emitting product-select with: ${value}`);
        this.addToList(value);
        
        try {
         
            if (this.dataset.hasOwnProperty('connect') && this.dataset.connect === 'host')
            {
                this.parentElement.connectFromHost(value);
            }
        } catch (error) {

            console.log(`ContentBrowser::emitListed(${value}): ${error}`);

        }

    }

    createListItem(title, options = {})
    {
        const item = new EntryHeader()
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
            console.log(`ContentBrowser listed: ${e.target.dataset}, ${title}`);
        });

        return headingRow;
    }

    getOptions(item)
    {
        const model = this.mModel;
        const title = item[model.titlekey];
        const fields = [];

        for (const fieldKey of model.fields)
        {
            const value = item[fieldKey];
            fields.push(value);
        }

        let thumbnail = undefined;

        try {
            thumbnail = `data:${item.imageFile.fileType};base64,${item.imageFile.data}`;
        }
        catch (error) {}

        return { title, fields, thumbnail };
    }

    addToList(item)
    {
        const options = this.getOptions(item);
        this.mContentList.appendChild( new EntryHeader(options) );
    }

    /**
     * Adds a string into the content array
     * ------------------------------------
     * @param {string} dataItem 
     */
    addItem( dataItem )
    {
        this.mList.push(dataItem);
        
        if (this.mContentList.children.length < 5) this.addToList( dataItem );
    }

    /**
     * Loads an array of strings as content
     * for the browser
     * ---------------
     * @param {Array<string>} dataSet 
     */
    pushDataSet(dataSet, model = [])
    {
        this.mList = [];
        this.mModel = model;
        this.mTitleKey = model.titlekey;

        for (const dataItem of dataSet )
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
        const key = this.mTitleKey;
        return this.mList.filter( entry => entry[key].toLowerCase().startsWith(needle) );
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

        this.pushDataSet(testSet);

    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------
    connectedCallback()
    {
        console.log("<entry-browser> connected");
        this.shadowRoot.addEventListener('content-header-click', e =>
        {
            const title = e.detail.title;

            e.preventDefault();
            e.stopPropagation();
         
            if (typeof title === 'string' && title.length)
            {
                this.emitListed(title);
            }
            
        }, true);
    }

    disconnectedCallback()
    {
        console.log("<entry-browser> disconnected");
    }
}
 

window.customElements.define('entry-browser', EntryBrowser );

export { EntryBrowser };