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
        
        this.mEditable = this.dataset.edit;

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
              <div class='component__popup'></div>
              <div class='component__row stats'>
                <p class='component__label'><slot></p>
                <div class='statsframe'>
                  <div class='stats__sort'></div>
                  <p class='stats__count'></p>
                </div>
                <div class='component__balancer'></div>
              </div>
              <div class='content__list'>
                <div class='progress__frame'>
                    <div class='loader'></div>
                </div>
              </div>
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
         @keyframes spinner {
             0% {
                 transform: translate3d(-50%,-50%, 0) rotate(0deg);
             }
             100% {
                transform: translate3d(-50%,-50%, 0) rotate(360deg);
            }
         }
         .progress__frame {
             display: flex;
             justify-content: center;
             align-items: center;
             width: 100%;
             height: 100%;
             position: absolute;
             background-color: rgba(255,255,255,.9);
         }
         .loader {
             border: 16px solid #0042a4;
             border-radius: 50%;
             border-top: 16px solid #3775cf;
             border-bottom: 16px solid #005588;
             width: 50px;
             height: 50px;
             animation: 1.5s linear infinite spinner;
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
        .component__row.stats {
            width: 100%;
            justify-content: space-between;
            padding-bottom: 8px;
        }
        .statsframe { 
            display: flex; 
            align-items: center;
            border-radius: 12px;
            width: 64px;
            height: 22px;
            border: 1px solid rgba(0,0,0,0.33);
            background-color: rgba(0,0,0,0.25);
            box-shadow: -3px -1px 12px -1px #0000003f;
         }
        .statsframe .stats__sort { 
            cursor: pointer;
            width: 19px; 
            height: 14px; 
            border-radius: 9px;
            border: 1px solid rgba(0,0,0,0.25);
            background-color: #f898988f;
            background-image: url( 'assets/ic_left.svg' );
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            box-shadow: 3px -3px 15px 4px #ffffffa0;
            margin-left: 4px;
            transform: scale3d(1,1,1);
            transition: transform .3s, border-color .5s, box-shadow .3s;
        }
        .statsframe .stats__sort:hover {
            transform: scale3d(1.2,1.2,1.2);
            box-shadow: -3px -3px 8px 2px #ffffffc8;
            border-color: rgba(0,0,0,0.67);
        }
        .statsframe .stats__count {
            width: 100%;
            color: #fff;
            text-align: center;
        }
        .component__popup {
            display: none;
            position: absolute;
            left: 50%;
            top: 0;
            z-index: 30;
            background-color: #fff;
            border-radius: 4px;
            border: 2px solid rgba(0,128,0,0.75);
            padding: 8px;
            width: 50%;
        }
        .component__popup .popup__item {
            padding: 4px;
            min-height: 20px;
            border-bottom: 1px solid rgba(0,0,0,0.25);
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
         * Progress frame
         */
        this.mProgressFrame = this.shadowRoot.querySelector('.progress__frame');

        /**
         * 
         */
        this.mPopupElement = this.shadowRoot.querySelector('.component__popup');
        this.hasPopup = false;
        this.lastPopup = '';

        /**
         * @member {HTMLDivElement} mSortElement
         */
        this.mSortElement = this.shadowRoot.querySelector('.stats__sort');
        this.mSortLatest = true;

        this.mSortElement.addEventListener('click', e => 
        {
            this.mSortLatest = ! this.mSortLatest;
            console.log(`SortLatest: ${this.mSortLatest}`);
            this.populateContentList( this.mSortLatest );
        });

        /**
         * @member {HTMLParagraphElement} mCountElement
         */
        this.mCountElement = this.shadowRoot.querySelector('.stats__count');

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
                this.closePopup();
            }

            if (matches.length)
            {
                const entryList = this.createEntryHeaders(matches);
                this.mScrollContainer.pushContent(entryList);
                this.mScrollContainer.blur();
            }
            else
            {
                this.mScrollContainer.clear();
            }

            this.closePopup();
        }, true);

        /**
         * @listen keyboard tab and keyup/down events
         */
         this.shadowRoot.addEventListener('keydown', e => 
         {
            switch( e.keyCode )
            {
                case this.KEYDOWN :
                {
                    this.mScrollContainer.down();
                    this.emitContent(false);
                    break;
                }
                case this.KEYUP :
                {
                    this.mScrollContainer.up();
                    this.emitContent(false);
                    break;
                }
                case this.ENTER :
                {
                    this.emitContent();   
                    break;
                }
            }
         });

        this.shadowRoot.addEventListener('focus', e => 
        {
            const target = e.target;
            //console.log(`Focus event from ${target.localName}.${target.className}`);
            e.stopPropagation();
            this.closePopup();
            componentFrame.classList.add('active');
        }, true);

        this.shadowRoot.addEventListener('blur', e =>
        {
            const target = e.target;
            //console.log(`Blur event from ${target.localName}.${target.className}`);
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

    renderStats()
    {
        this.mCountElement.textContent = `${this.mList.length}`;
    }

    /**
     * Creates entry headers from the matched entries
     * ----------------
     * @param  {object} list 
     * @return {Array<EntryHeader>} 
     */
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

    emitContent(open = true)
    {
        if ( ! open && ! this.hasPopup ) return;

        const title = this.mScrollContainer.valueAtIndex;
        const key   = this.mTitleKey;
        const entry = this.mList.find(entry => entry[key].toLowerCase() === title.toLowerCase());

        if ( title === this.lastPopup)
        {
            this.closePopup();
            return;
        }

        if ( entry ) this.openPopup(entry);       
    }

    /**
     * Parses a certain set of data using the model
     * That was passed along the dataset
     * @param {object} item 
     * @return {string,string,array,image} 
     */
    getOptions(item)
    {
        const model  = this.mModel;
        const title  = item[model.titlekey];
        const fields = [];
        const key    = model.titlekey;

        fields.push( {[key]: title} );

        for (const fieldKey of model.fields)
        {
            fields.push( {[fieldKey]: item[fieldKey]} );
        }

        let thumbnail = undefined;

        try {

            thumbnail = `data:${item.mediaDto.thumbnail.type};base64,${item.mediaDto.thumbnail.data}`
        }
        catch (error) {}

        const editable = this.mEditable ? true : false;
        
        return { key, title, fields, thumbnail, editable };
    }

    addToList(item)
    {
        const options = this.getOptions(item);
        this.mContentList.appendChild( new EntryHeader(options) );
    }

    populateContentList(latest = true)
    {
        deleteChildren(this.mContentList);
    
        if ( ! this.mList.length ) return;

        const amount = this.mList.length > 5 ? 5 : this.mList.length;
        const size = this.mList.length - 1;
        let   i;

        for ( i = 0; i < amount; i++ ) 
        {
            this.addToList( this.mList[ latest ? size - i : i ] );
        } 
    }

    /**
     * Adds a string into the content array
     * ------------------------------------
     * @param {string} dataItem 
     */
    addItem( dataItem )
    {
        this.mList.push(dataItem);      
    }

    /**
     * Loads an array of strings as content
     * for the browser
     * ---------------
     * @param {Array<object>} dataSet 
     */
    pushDataSet(dataSet, model = [])
    {
        this.startProgress();

        this.mList     = [];
        this.mModel    = model;
        this.mTitleKey = model.titlekey;

        for ( const dataItem of dataSet )
        {
            this.mList.push( dataItem );
        }

        this.populateContentList();
        this.renderStats();

        this.stopProgress();
    }

    stopProgress()
    {
        this.mProgressFrame.style.display = 'none';
    }

    startProgress()
    {
        this.mProgressFrame.style.display = 'flex';
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
        const  key = this.mTitleKey;
        return this.mList
            .filter( entry => entry[key].toLowerCase().startsWith( needle.toLowerCase() ) );
    }

    closePopup()
    {
        deleteChildren(this.mPopupElement);

        this.mPopupElement.style.display = 'none';
        this.hasPopup  = false;
        this.lastPopup = '';
    }

    openPopup(entry)
    {
        deleteChildren(this.mPopupElement);

        /**
         * Create the content
         */
        for (const key in entry)
        {
            const popupItem = newTagClassHTML
            (
                'p', 'popup__item', `${key}: ${entry[key]}`
            );

            this.mPopupElement.appendChild( popupItem );
        }

        /**
         * Set the display on
         */
        const key = this.mTitleKey;

        this.mPopupElement.style.display = 'block';
        this.hasPopup  = true;
        this.lastPopup = entry[key];

        /**
         * Create a closing system
         */
        this.mPopupElement.addEventListener('click', e =>
        {
            return this.closePopup();
        });
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------
    connectedCallback()
    {
        /**
         * @listens entry-header-click
         */
        this.shadowRoot.addEventListener('entry-header-click', e =>
        {
            const title = e.detail.title;

            e.preventDefault();
            e.stopPropagation();

            if ( title === this.lastPopup )
            {
                this.closePopup();
                return;
            }
            
            const key = this.mTitleKey;
            const entry = this.mList.find(entry => entry[key].toLowerCase() === title.toLowerCase());
    
            if ( entry ) this.openPopup(entry);
        }, true);

        /**
         * Common function that parses the custom event detail
         * And emits another custom event, using the event detail
         * To search for an id, that is emitted
         * @param {Event}  e 
         * @param {string} emitter 
         */
        const transmit = (e, emitter) =>
        {   
            const title = e.detail.title;

            e.preventDefault();
            e.stopPropagation();

            console.log(`EntryBrowser: header ${title}`);

            const key   = this.mTitleKey;
            const entry = 
            this.mList.find(entry => entry[key].toLowerCase() === title.toLowerCase());

            if ( entry && entry.hasOwnProperty('id') )
            {
                this.shadowRoot.dispatchEvent
                (
                    new CustomEvent( emitter, 
                    {
                        bubbles: true,
                        composed: true,
                        detail: { 'entry': entry }
                    })
                );
            }
        }

        /**
         * @listens header-remove
         * @emits   remove-by-id
         */
        this.shadowRoot.addEventListener
        (
            'header-remove', 
            e => transmit( e, 'remove-by-id' ), 
            true
        );

        /**
         * @listens header-edit
         * @emits   edit-by-id
         */
        this.shadowRoot.addEventListener
        (
            'header-edit', 
            e => transmit( e, 'edit-by-id' ),
            true
        );

    }

    disconnectedCallback()
    {
        console.log("<entry-browser> disconnected");
    }
}
 

window.customElements.define('entry-browser', EntryBrowser );

export { EntryBrowser };