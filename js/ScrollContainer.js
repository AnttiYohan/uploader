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
         super();
         
         /**
          * Holds an array of content header title strings
          * @property {String[]}
          */
        this.mContentSet = [];

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
            min-height: 200px;
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

         this.shadowRoot.addEventListener('header-removed', e =>
         {
            console.log(`ContentBrowser::ScrollContainer -- 'header-removed' event intercepted`);
         }, true);

         
    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------

    clear()
    {
        this.mContentSet = [];
        deleteChildren( this.mContainer );
    }

    count()
    {
        return this.mContainer.children.length;
    }

    addElement(element)
    {
        if (element instanceof ContentHeader)
        {
            this.mContainer.appendChild(element);
            return true;
        }

        return false;
    }

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

                this.mContainer
                    .appendChild(new ContentHeader(options));

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

    resetActions()
    {

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

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<scroll-container> connected");
        this.emit('scroll-container-connected');
    }

    disconnectedCallback()
    {
        console.log("<scroll-container> disconnected");
    }  
}

window.customElements.define('scroll-container', ScrollContainer );

export { ScrollContainer }
 