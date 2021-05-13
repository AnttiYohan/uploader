import { BinarySwitch } from './BinarySwitch.js'
import { BinaryBase } from './BinaryBase.js';

/**
 * Multi Select input container
 */
class BinarySwitchGroup extends BinaryBase
{
    constructor()
    {
        super({multiSelect: true, type: 'string'});
        
        // ------------------------------------------------------
        // - Add the group list items as binary switches
        // ------------------------------------------------------

        if (this.mGroupList.length)
        {
            for (const item of this.mGroupList)
            {
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