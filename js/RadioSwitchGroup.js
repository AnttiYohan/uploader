import { WCBase, props } from './WCBase.js';
import { RadioSwitch } from './RadioSwitch.js';

/**
 * Container class for RadioSwitch elements
 * ======================================== 
 */
class RadioSwitchGroup extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Read the group attribute
        // -----------------------------------------------

        this.mSwitchArray = [];
        this.mGroupList = [];
        this.mContentAmount = 0;

        /*
        if (this.hasAttribute('content-amount'))
        {
            this.mContentAmount = parseInt(this.getAttribute('content-amount'));

            if (typeof(this.mContentAmount) !== Number)
            {
                this.mContentAmount = 12;
            }
        }*/
        
        let gridPrefix = '';

        if (this.hasAttribute('group'))
        {
            const group  = this.getAttribute('group');
            const parsed = group ? JSON.parse(group) : undefined;

            if (Array.isArray(parsed))
            {
                this.mGroupList = parsed;
            }

            this.mContentAmount = this.mGroupList.length;

            // -----------------------------------
            // - Check the content amount oddity
            // -----------------------------------

            if (this.mContentAmount % 6 === 0)
            {
                    gridPrefix = '--12';
            }
            else
            if (this.mContentAmount % 5 === 0)
            {
                gridPrefix = '--10';
            }
        }
        else
        {
            console.log(`attribute group not found`);
        }

        console.log(`GridPrefix: ${gridPrefix}`);

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        

        this.setupTemplate
        (
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='component'>  
           <p class='component__label'><slot></p>
           <div class='component__grid${gridPrefix}'>
           </div>
         </div>`
        );

        console.log(`.component__grid${gridPrefix}`);

        this.mContainerElement = this.shadowRoot.querySelector(`.component__grid${gridPrefix}`);
     
        // ------------------------------------------------------
        // - Add the group list items as radio buttons
        // ------------------------------------------------------

        if (this.mGroupList.length)
        {
            let index = 0;

            for (const item of this.mGroupList)
            {
                const state = index > 0 ? false : true;
                index++;

                this.mContainerElement.appendChild
                (
                    new RadioSwitch(item, state)
                );
            }

            // -------------------------
            // - Create the switch array
            // -------------------------

            this.mSwitchArray = Array.from(this.mContainerElement.children);

        }
    }

    /**
     * Returns the titles of every active 
     * RadioSwitch elements
     * 
     * @return {Array}
     */
    get stateList()
    {
        const list = [];

        for (const elem of this.mSwitchArray)
        {
            if (elem.state) list.push({name: elem.title});
        }

        return list;
    }

    /**
     * Reset the group to initial state,
     * The first element will be active
     */
    reset( firstOff = false )
    {
        this.mSwitchArray[0].state = !firstOff;

        const len = this.mSwitchArray.length;
        
        for (let i = 1; i < len; i++)
        {
            this.mSwitchArray[i].turnOff();
        }
    }

    /**
     * Returns the active RadioSwitch title
     * ====================================
     * @return {string}
     */
    get active()
    {
        for (const elem of this.mSwitchArray)
        {
            if (elem.state) return elem.value;
        }

        return '';
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<radio-switch-group> connected");
        
        // -----------------------------------------
        // - Handler fot 'state-change' event:
        // - Grab the title from the event sender
        // - And turn off everyone of its siblings
        // -----------------------------------------

        this.shadowRoot.addEventListener('state-change', e =>
        {
            // ---------------------------------
            // - Receive the title detai
            // ---------------------------------

            const title = e.detail.title;

            //console.log(`RadioSwitchGroup: child title: ${title}`);
            // ---------------------------------
            // - Grab all other switches
            // ---------------------------------

            const siblingList = this.mSwitchArray.filter((elem) => elem.title !== title);

            console.log(`RadioSwitchGroup: Sibling list length: ${siblingList.length}`);
            // ------------------------------
            // - Turn off all of the siblings
            // ------------------------------

            siblingList.forEach((elem) => elem.turnOff());
        

        }, true);
    }

    disconnectedCallback()
    {
        console.log("<radio-switch-group> disconnected");
    }  
}

window.customElements.define('radio-switch-group', RadioSwitchGroup );

export { RadioSwitchGroup };