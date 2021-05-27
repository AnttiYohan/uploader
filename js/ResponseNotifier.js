import { WCBase } from './WCBase.js';

/**
 * Creates a spinning animation, stops when request
 * has arrived and displays it briefly
 * ---------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class ResponseNotifier extends WCBase
{
    constructor(response, msgOk, msgFail)
    {
        super();
        
        /** Response callback */
        this.mResponse  = response;
        this.mMsgOk     = msgOk;
        this.mMsgFail   = msgFail;

        /**
         * Setup the shadow DOM
         */
        this.attachShadow({mode : 'open'});
        this.setupStyle
        (`.frame {
            width: 128px;
            height: 128px;
            background-color: #45d838;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,0.15);
            box-shadow: 2px 4px 12px -3px rgba(0,0,0,0.25);
        }
        .progress {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 14px;
            left: 14px;
        }
        .header--msg {
            width: 110px;
            height: 32px;
        }
        .response {
            width: 110px;
            height: auto;
        }`);

        this.setupTemplate
        (`<div class='frame'>
            <div class='progress'></div>
            <p class='header--msg'></p>
            <p class='response'></p>
          </div>`);

       
    }

    begin()
    {

    }

    end()
    {

    }

    
    
    

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
    }
  
}

window.customElements.define('response-notifier', ResponseNotifier );

export { ResponseNotifier };