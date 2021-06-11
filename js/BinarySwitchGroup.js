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

        this.mNull = this.hasAttribute('data-null')
                   ? true
                   : false;

        
        let index = 1;
        if (this.mGroupList.length)
        {
            for (const item of this.mGroupList)
            {
                let state = false;
                /*if (index === 1 && ! this.mNull)
                {
                    state = true;
                }*/

                if (item.hasOwnProperty('fill'))
                {
                    console.log(`Fill: ${item.rule}`);
                }
                this.mContainerElement.appendChild(new BinarySwitch(item, state));

                index++;
            }

            // -------------------------
            // - Create the switch array
            // -------------------------

            this.mSwitchArray = Array.from(this.mContainerElement.children);

            console.log(`BinarySwitchGroup is null ${this.mNull}`);
            if ( ! this.mNull) this.mSwitchArray[0].turnOn();
        }
    }

    get count()
    {
        let result = 0;

        for (const elem of this.mSwitchArray)
        {
            if ( elem.state ) result++;
        }

        return result;
    }

    pushDataSet( list )
    {
        let wasFirstApplied = false;
        for ( const item of list )
        {
            const value = item.name;

            const matchingSwitch = this.mSwitchArray.find( elem => elem.value === value);

            if ( matchingSwitch )
            {
                matchingSwitch.turnOn();
                wasFirstApplied = this.mSwitchArray[0].value === value; 
            }
        }

        if ( ! this.mNull && ! wasFirstApplied )
        {
            if ( this.count > 1 ) this.mSwitchArray[0].turnOff();
        }
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<binary-switch-group> connected");
        this.emit( 'binary-switch-group-connected' );

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
        if ( ! this.mNull) 
        {
            this.shadowRoot.addEventListener('switch-off', e => 
            {
                let count = 0;
                for (const elem of this.mSwitchArray)
                {
                    if (elem.state) count++;
                }

                if (count === 0)
                {
                    e.target.turnOn();
                }
            })
        }
    }

    disconnectedCallback()
    {
        console.log("<binary-switch-group> disconnected");
    }  
}

window.customElements.define('binary-switch-group', BinarySwitchGroup );

export { BinarySwitchGroup };