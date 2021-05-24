import { WCBase, props } from './WCBase.js';
import { ScrollContainer } from './ScrollContainer.js';
import { deleteChildren, newTagClassChildren, newTagClassAttrsChildren, newTagClassHTML, newTagClassAttrs } from './util/elemfactory.js';
import { ContentHeader } from './ContentHeader.js';

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
              <scroll-container class='container' data-height='120'></scroll-container>
            </div>
        `);
        
        this.setupStyle
         (`.component {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            border-radius: 8px;
            border: 2px solid transparent;
            box-shadow: 0 0 12px -5px rgba(0, 0, 0, 0.25);    
            background-color: #fff;
            padding-top: 4px;
         }
        .component:focus {
            outline: 2px solid #222;
        }
        .component.active {
            border: 2px solid rgba(0, 0, 0, 0.5);
        }
        .content__list {
            position: relative;
            display: none;
            flex-direction: column;
            width: 100%;
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
            border-radius: 6px;
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
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
                const content = this.createContent( matches );
                this.mScrollContainer.pushContent( content );
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

    createContent(list)
    {
        const result = [];

        for (const item of list)
        {
            const key = 'name';
            const title = item[key];
            result.push( new ContentHeader( {title} ) );
        }

        return result;
    }

    emitContent()
    {
        const title = this.mScrollContainer.valueAtIndex;
        const obj = this.createEmission(title);
        try {
            if (obj) this.parentElement.connectFromHost( obj );
        } catch (error) {
            console.log(`IngredientMenu::emitContent(${title}): ${error}`);
        }

    }

    emitClicked(title)
    {
        const obj = this.createEmission(title);
      
        try {
            if (obj) this.parentElement.connectFromHost( obj );
        } catch (error) {
            console.log(`IngredientMenu::emitClicked(): ${error}`);
        }
    }

    createEmission(title)
    {
        const comparison = title.toLowerCase();
        console.log(`IngredientMenu::createEmission title: ${comparison}`);
        const titleKey = 'name';
       
        const entry = this.mList.find(item => item['name'].toLowerCase() === comparison);

        console.log(`Entry is: ${entry.name}`);
        return entry;

        if ( entry )
        {
            const productCategory = entry.hasOwnProperty('productCategory')
                                ? entry.productCategory
                                : '';

            const hasAllergens  = entry.hasOwnProperty('hasAllergens')
                                ? entry.hasAllergens
                                : false;

            const hasEggs  = entry.hasOwnProperty('hasEggs')
                                ? entry.hasEggs
                                : false;

            const hasNuts  = entry.hasOwnProperty('hasNuts')
                                ? entry.hasNuts
                                : false;

            const hasGluten  = entry.hasOwnProperty('hasGluten')
                                ? entry.hasGluen
                                : false;

            const hasLactose  = entry.hasOwnProperty('hasLactose')
                                ? entry.hasLactose
                                : false;

            return {
                name: entry[titleKey],
                productCategory,
                hasAllergens,
                hasEggs,
                hasNuts,
                hasGluten,
                hasLactose                
            };
        }

        return undefined;
    }

    /**
     * Adds a string into the content array
     * ------------------------------------
     * @param {string} dataItem 
     */
    addItem( dataItem )
    {
        this.mList.push( dataItem );
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
        const key = 'name';
        return this.mList.filter( entry => entry[key].toLowerCase().startsWith(needle) );
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
      
            this.emitClicked(title);
            
        }, true);
    }

    disconnectedCallback()
    {
        console.log("<ingredient-menu> disconnected");
    }
}
 

window.customElements.define('ingredient-menu', IngredientMenu );

export { IngredientMenu };