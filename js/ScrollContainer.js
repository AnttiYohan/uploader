import { WCBase, props } from './WCBase.js';
import { deleteChildren } from './util/elemfactory.js';
import { ContentHeader } from './ContentHeader.js';
/**
 * 
 */
class ScrollContainer extends WCBase
{
    constructor()
    {
        // ---------------------------------------------
        super();
         
        // ---------------------------------------------
        // -
        // -
        // ---------------------------------------------

        this.hasFocus = false;

        this.cursor =
        {
            pos: 0,
            h:   5,
            y:   0,
        };

        /**
          * Holds an array of content header title strings
          * @property {String[]}
          */
        this.mContentSet = [];

        /**
         * Row height
         */
        this.rowHeight = 28;

        this.rowIndex = -1;
         // -----------------------------------------------
         // - Setup ShadowDOM: set stylesheet and content
         // - from template 
         // -----------------------------------------------
 
         this.attachShadow({mode : "open"});
   
         this.setupTemplate
         (`<link rel='stylesheet' href='assets/css/components.css'>
             <div class='component container'>
             </div>
         `);
 
         this.setupStyle
         (`.component.container {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100px;
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            box-shadow: 0 0 12px -5px rgba(0, 0, 0, 0.25);    
            background-color: #fff;
            overflow-y: scroll;
         }
         .component.container:hover {
            border: 1px solid rgba(0, 0, 0, 0.25);
            background-color: #eee;
        }
        .component.container:focus {
            outline: 2px solid #222;
        }
        .component.container:active {
            padding-top: calc(var(--component-pad, 8px) - 1);
            padding-bottom: calc(var(--component-pad, 8px) - 1);
            border: 2px solid rgba(0, 0, 0, 0.5);
            min-height: 22px;
        }`);

         this.mContainer = this.shadowRoot.querySelector('.container');

         this
            .shadowRoot
            .addEventListener('header-removed', e =>
         {
            console.log(`ContentBrowser::ScrollContainer -- 'header-removed' event intercepted`);
         }, true);

         
    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------

    get valueAtIndex()
    {
        let result = undefined;

        const rows = this.mContainer.children;

        if (this.hasFocus && this.rowIndex > -1)
        {
            result = rows[this.rowIndex].title; 
        }

        return result;
    }

    clear()
    {
        this.rowIndex = -1;
        this.hasFocus = false;
        deleteChildren( this.mContainer );
    }

    count()
    {
        return this.mContainer.children.length;
    }

    blur()
    {
        this.hasFocus = false;
        this.rowIndex = -1;
    }


    /**
     * 
     * 
     * @param  {ContentHeader} element 
     * @return {boolean}
     */
    addElement(element)
    {
        if(element instanceof ContentHeader)
        {
            this.mContainer.appendChild(element);
            return true;
        }

        return false;
    }

    /**
     * 
     * @param {Array<string>} list 
     */
    pushContent(list)
    {
        this.clear();

        for (const element of list)
        {
            this.addElement(element);
        }
    }

    /**
     * Creates ContentHeader instances utilizing the provided
     * string content into the titles.
     * Applies actions, when provided, 
     * unless there were actions stored in beforehand.
     * --------------------------------------------
     * @param {Array<string>} content 
     * @param {Array<object>} actions 
     */
    pushContentAsStrings(content, actions = [])
    {
        this.clear();
        
        if (this.validateActions(actions))
        {
            let rowIndex = 0;
            for (const title of content)
            {
                const options =
                {
                    title,
                    rowIndex,
                    actions
                };

                this
                .mContainer
                .appendChild( new ContentHeader(options) );

                rowIndex++;
            }
        }
    }

    storeActionsToUse(actions)
    {

    }

    /**
     * Returns the truth value of a validation
     * process, that checks a set of action objects.
     * If every object contains the proper properties,
     * The validation result is considered a success.
     * -------------------------------  
     * @param  {Array<object>} actions
     * @return {boolean} 
     */
    validateActions(actions)
    {
        let result = Array.isArray(actions);
        
        if (result && actions.length)
        { 
            for (const action of actions)
            {       
                result = action.hasOwnProperty('type')    &&
                         action.hasOwnProperty('detail')  &&
                         action.hasOwnProperty('iconUrl');

                if ( ! result) break;
            }
        }

        return result;
    }

    createTestContent(count = 25)
    {
        let i = 0;
        let successCount = 0;

        for (i = 0; i < count; i++)
        {
            const actionObject = 
            {
                'type': 'search-fill',
                'detail': `works from n${i+1}`,
                'iconUrl': 'assets/icon_arrow_down.svg'
            };

            const actions = new Array(actionObject);

            const options = 
            {
                'title': `Test ${i+1}`,
                'rowIndex': i,
                 actions
            };

            if (this.createElement(options)) successCount++;
        }

        console.log(`ScrollContainer: Attempted to create new ContentHeader elems ${count}, succeeded in ${successCount}`);
    
        return count === successCount;
    }

    removeElementAt(index)
    {
        Array.from(this.mContainer.children)[index].remove();
    }

    createElement(options)
    {
        let result = false;

        console.log(`ScrollContainer::createElement() called, title: ${options.title}`);

        if ( ! options.hasOwnProperty('title')) return result;

        let amount = -1;

        try {
            amount = options.actions.length;
        } catch(error) {
            console.log(`Error while reading actions amount: ${error}`);
        }

        console.log(`createElement(): validate actions. Amount: ${amount}`);

        if (options.hasOwnProperty('actions'))
        {
            if ( ! Array.isArray(options.actions)) return result;

            let index = 1;
            for (const action of options.actions)
            {
                const valid =   action.hasOwnProperty('type')    &&
                                action.hasOwnProperty('detail')  &&
                                action.hasOwnProperty('iconUrl');

                console.log(`createElement(): action ${index} propery validation ${valid?'succeeded':'failed'}`);

                if ( ! valid ) return result;

                index++;
            }
        }

        result = this.addElement(new ContentHeader(options));

        console.log(`Element created and added, the result: ${result}`);

        return result;
    }

    up()
    {
        const rows = this.mContainer.children;

        if ( ! this.hasFocus)
        {
            this.rowIndex = rows.length - 1;
            rows[this.rowIndex].select();
            const distance = this.rowIndex * this.rowHeight;
            this.mContainer.scroll({top: distance});
            this.hasFocus = true;
            return;
        }

        rows[this.rowIndex].reject();
        this.rowIndex--;

        if (this.rowIndex < 0)
        {
            this.rowIndex = rows.length - 1;
            const distance = this.rowIndex * this.rowHeight;
            this.mContainer.scroll({top: distance});
            rows[this.rowIndex].select();
            return;
        }

        rows[this.rowIndex].select();
        /*
        const bounds = this.mContainer.getBoundingClientRect();
        const rowBounds = rows[this.cursor.pos].getBoundingClientRect();
        
        const viewBottom = bounds.top + bounds.height;
        const rowBottom  = rowBounds.top + rowBounds.height;

        console.log(`ScrollContainer::down() cursor pos: ${this.cursor.pos}`);

        console.log(`Container bottom: ${viewBottom}, pos bottom: ${rowBottom}`);

        const diff = (rowBottom + 4) - viewBottom;

        if (diff > 0)
        {
            //this.mContainer.scrollBy({y: diff, behavior: 'smooth'});
            this.scrollBy(0, diff);
        }*/

        const cursorTop = this.rowIndex * this.rowHeight;   
        const viewTop = this.mContainer.scrollTop;

        console.log(`View top: ${viewTop}, cursor top: ${cursorTop}`);

        const diff = cursorTop - viewTop;

        const height = this.mContainer.getBoundingClientRect().height;

        if (diff < 0)
        {
            const mod = -diff % this.rowHeight;
            console.log(`Diff${-diff} mod 28 => ${mod}`);
            const distance = mod - diff;
            this.mContainer.scrollTo(0, cursorTop);
            //this.mContainer.scroll({top: distance, behavior: 'smooth'});
        }

    }

    down()
    {
        const rows = this.mContainer.children;
        
        if ( ! this.hasFocus)
        {
            this.rowIndex = 0;
            rows[this.rowIndex].select();
            this.hasFocus = true;
            return;
        }

        rows[this.rowIndex].reject();
        this.rowIndex++;

        if (this.rowIndex >= this.mContainer.children.length)
        {
            this.rowIndex = 0;
            this.mContainer.scrollTo(0, 0);
            rows[this.rowIndex].select();
            return;
        }

        rows[this.rowIndex].select();

        const bounds = this.mContainer.getBoundingClientRect();
        const cursorBottom = this.rowIndex * this.rowHeight + this.rowHeight;   
        const viewBottom = bounds.height;

        console.log(`Container bottom: ${viewBottom}, pos bottom: ${cursorBottom}`);

        const diff = viewBottom - cursorBottom;

        if (diff < 0)
        {
            const mod = -diff % this.rowHeight;
            console.log(`Diff${-diff} mod 28 => ${mod}`);
            const distance = mod - diff;
            this.mContainer.scroll({top: distance});
        }

    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<scroll-container> connected");
        this.emit('scroll-container-connected');

        /*
        this.shadowRoot.addEventListener('content-header-click', e =>
        {
            const title = e.detail;

            console.log(`ScrollContainer: ${e.target} item click received`);

        }, true);*/
    }

    disconnectedCallback()
    {
        console.log("<scroll-container> disconnected");
    }  
}

window.customElements.define('scroll-container', ScrollContainer );

export { ScrollContainer }
 