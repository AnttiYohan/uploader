import { WCBase, props } from './WCBase.js';
import { BinarySwitch } from './BinarySwitch.js'
/**
 * 
 */
class BinarySwitchGroup extends WCBase
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

        console.log(`Binary Switch Group: GridPrefix: ${gridPrefix}`);

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

        this.mContainerElement = this.shadowRoot.querySelector(`.component__grid${gridPrefix}`);
     
         // ------------------------------------------------------
        // - Add the group list items as binary switches
        // ------------------------------------------------------

        if (this.mGroupList.length)
        {
            let index = 0;

            for (const item of this.mGroupList)
            {
                //const state = index > 0 ? false : true;
                //index++;

                this.mContainerElement.appendChild
                (
                    new BinarySwitch(item, false)
                );
            }

            // -------------------------
            // - Create the switch array
            // -------------------------

            this.mSwitchArray = Array.from(this.mContainerElement.children);

        }
        //this.mContainerElement = this.shadowRoot.querySelector('.container');
        //this.mContainerElement.addEventListener('click', e => { console.log(this.stateList); });
    }

    get stateList()
    {
        const list = [];

        for (const elem of this.mContainerElement.children)
        {
            if (elem.state) list.push({name: elem.textContent.toUpperCase()});
        }

        return list;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<binary-switch-group> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<binary-switch-group> disconnected");
    }  
}

window.customElements.define('binary-switch-group', BinarySwitchGroup );

export { BinarySwitchGroup };