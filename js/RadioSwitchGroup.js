import { RadioSwitch } from './RadioSwitch.js';
import { SelectBase } from './SelectBase.js';

/**
 * Container class for RadioSwitch elements
 * ======================================== 
 */
class RadioSwitchGroup extends SelectBase
{
    constructor()
    {
        super({multiSelect: false, type: 'string'});
        
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