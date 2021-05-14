import { WCBase, props } from './WCBase.js';

/**
 * Catches and emits events
 */
class EventBouncer extends WCBase
{
    constructor()
    {
        super();

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        //this.attachShadow({mode : "open"});
        //this.setupTemplate('<div></div>');
        /*this.setupTemplate
        (`<div class='switch ${state ? "active" : ""}'>${this.mTitle}</div>`);*/

    }

    connectFromHost(data)
    {
        //let host = undefined;
        //let slave = undefined;

        for (const child of this.children)
        {
            if (child.dataset.connect === 'slave')
            {
                console.log(`EventBouncer, slave: ${child.localName}, applyConnection: ${data}`);
                child.applyConnection(data);
            }
        }
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<event-bouncer> connected");

        const group = this.getAttribute('data-emitters');

        /**
         * Parse events from emitter group
         */
        const emitters = group ? JSON.parse(group) : undefined;

        if (! Array.isArray(emitters)) return;

        /**
         * Create listeners and emitters
         */
        for (const emitterName of emitters)
        {
            if (typeof emitterName !== 'string' || emitterName.length === 0)
            {
                console.log(`EventBouncer: cannot listen/emit emitter: ${emitterName} -- not a string/empty`);
                return;
            }

            console.log(`EventBouncer: Listen and emit ${emitterName} event`);

            this.addEventListener(emitterName, e => 
            {
                console.log(`EventBouncer: ${emitterName} catched`);
                if (e.detail) console.log(`Detail: ${e.detail}`);
                //this.emit(emitterName, e.detail ? e.detail : '');
                e.stopPropagation();
                const bounceEvent = new CustomEvent
                (
                    emitterName,
                    {
                        bubbles: false,
                        composed: true,
                        detail: e.detail
                    }
                );
                this.dispatchEvent(bounceEvent);
            });
        }

        //this.addEventListener
        //this.emit('search-input-connected');
    }

    disconnectedCallback()
    {
        console.log("<event-bouncer> disconnected");
    }
}
 

window.customElements.define('event-bouncer', EventBouncer);

export { EventBouncer };        