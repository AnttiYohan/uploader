import { WCBase, props } from './WCBase.js';
import { RadioSwitch } from './RadioSwitch.js'
/**
 * 
 */
class RadioSwitchGroup extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Read the group attribute
        // -----------------------------------------------

        this.mSwitchMap = {};
        this.mSwitchArray = [];
        this.mGroupList = [];

        if (this.hasAttribute('group'))
        {
            const group = this.getAttribute('group');
            console.log(`RadioSwitchGroup: attribute group found: ${group}`);

            const parsed = JSON.parse(group);

            if (Array.isArray(parsed))
            {
                console.log(`Parsed Group array length: ${parsed.length}`);
                this.mGroupList = parsed;
            }
            else
            {
                console.log(`Group could not be parsed as an array`)
            }
        }
        else
        {
            console.log(`atrribute group not found`);
        }

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .row {
            display: flex;
            flex-direction: row;
            width: ${props.frame_width};
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};     
        }
        .row__paragraph {
            font-size: ${props.text_font_size};
            font-weight: 200;
            font-color: #222;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            padding: 4px;
            justify-content: center;
            align-items: center;
            width: ${props.frame_width};
            border: 1px solid ${props.grey};
            border-radius: 4px;
        }`);

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='row'>
           <p class='row__paragraph'><slot></p>
        </div>
        <div class='container'>
        </div>`);

        this.mContainerElement = this.shadowRoot.querySelector('.container');
        //this.mContainerElement.addEventListener('click', e => { console.log(this.stateList); });

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

            // ---------------------------------
            // - Grab all other switches
            // ---------------------------------

            const siblingList = this.mSwitchArray.filter((elem) => elem.title !== title);

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