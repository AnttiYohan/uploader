import { BinarySwitch } from './BinarySwitch.js';
import { SelectBase } from './SelectBase.js';

/**
 * Multi Select input container
 */
class BinarySwitchGroup extends SelectBase
{
    constructor()
    {
        super({multiselect: true, type: 'string'});
        
        // ------------------------------------------------------
        // - Add the group list items as binary switches
        // ------------------------------------------------------

        if (this.mGroupList.length)
        {
            for (const item of this.mGroupList)
            {
                if (item.hasOwnProperty('fill'))
                {
                    console.log(`Fill: ${item.rule}`);
                }
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
        this.shadowRoot.addEventListener('switch-fill-on', e =>
        {
            console.log(`BinarySwitchGroup: fill on received`);
            this.fill();
        });
        this.shadowRoot.addEventListener('switch-fill-off', e =>
        {
            console.log(`BinarySwitchGroup: fill off received`);
            this.empty();
        });
    }

    disconnectedCallback()
    {
        console.log("<binary-switch-group> disconnected");
    }  
}

window.customElements.define('binary-switch-group', BinarySwitchGroup );

export { BinarySwitchGroup };