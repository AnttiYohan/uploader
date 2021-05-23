import { WCBase, props } from './WCBase.js';

/**
 * Content browser consists of a search input element
 * ans a scroll container below the search elem.
 * The scroll container is populated with the search
 * results
 * Browser emits events when an item in the container
 * is clicked/pressed on/touched
 * Browser also listens to changes in the dataset.
 * 
 * @emits   element-removed
 * ======================================== 
 */
class ContentHeader extends WCBase
{
    constructor(options = {})
    {
        super();

        /**
         * The title of the content
         * ---------
         * @property {string} mTitle
         */
        this.mTitle = options.hasOwnProperty('title') ? options.title : '';

        /**
         * The Order of the current row
         * ---------
         * @property {number} mRowIndex
         */
        this.mRowIndex = options.hasOwnProperty('rowIndex') ? options.rowIndex : -1;

        /**
         * Actions for the header, action object includes:
         * 1) Event type that should emit when action is clicked
         * 2) Event detail that should be included in the event
         * 3) Action button icon url
         * -------------------------
         */
        this.mActions = options.hasOwnProperty('actions') ? options.actions : [];

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component__row'>
              <p class='component__title'>${this.mTitle}</p>
            </div>
        `);
        
        this.setupStyle
        (`.frame { display: flex; align-items: center; }
        .action {
           cursor: pointer;
           border-radius: 8px;
           width: 32px;
           height: 32px;
           padding: 2px;
           background-repeat: no-repeat;
           background-size: cover;
           border: 2px solid transparent;
           transition: border-color .3s;
        }
       .action:hover {
           border-color: rgba(0,0,0,.25);
       }
       .action:focus {
           border-color: rgba(255,80,80,0.5);
           outline: none;
       }
       .action:active {
           outline: none;
           border-color: rgba(0, 0, 0, 0.5);
       }
       .action.edit {
           background-image: url('assets/icon_edit.svg');
       }
       .action.remove {
           background-image: url('assets/icon_delete_perm.svg');
       }
       .thumbnail {
           border-radius: 8px;
           border: 1px solid rgba(0,0,0,0.15);
           object-fit: cover;
           object-position: center;
           width: 32px;
           height: 32px;
           padding: 3px;
       }
       .component__row {
           cursor: pointer;
           background-color: transparent;
           height: 40px;
           border: 2px solid transparent;
           border-radius: 6px;
           justify-content: space-between;
           align-items: center;
           transition: border-color .3s, background-color .3s;
       }
       .component__title {
           width: 100%;
           font-size: 14px;
           color: #444;
           text-align: middle;
           margin-left: 1em;
           transform: scale3d(1,1,1);
           transition: transform .5s ease-in-out;
       }
       .component__field {
           min-width: 48px;
       }
       .component__row:hover {
           background-color: rgba(0,0,0,0.1);
       }
       .component__row.selected {
           border-color: rgba(0,0,0,0.5);
       }
       .component__row.selected .component__title {
           transform: scale3d(1.05,1.05,1.05);
       }`);

        /**
         * The Content Header wrapper element
         * @member {HTMLDivElement} mRowElement
         * -------
         */
         this.mRowElement = this.shadowRoot.querySelector('.component__row');
         this.mRowElement.addEventListener('click', e =>
         {
             //this.emit('content-header-click', 'hardcode' );
             this.shadowRoot.dispatchEvent
             (
                 new CustomEvent('content-header-click', 
                 {
                     bubbles: true,
                     composed: true,
                     detail: 
                     {
                         "title": this.mTitle,
                         "other": 'hardcode'
                     }
                 })
             );
         });
        /**
         * Listen for scroll container cursor change events
        */
        this.shadowRoot.addEventListener('cursor-change', e =>
        {
            const msg = e.target.detail;

            if ( msg.select ) 
            {
                this.select();
            }
            else if ( msg.reject )
            {
                this.reject();
            }
            
        }, true);

    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------

    get title()
    {
        return this.mTitle;
    }

    get rowIndex()
    {
        return this.mRowIndex;
    }

    select()
    {
        this.mRowElement.classList.add('selected');
    }

    reject()
    {
        this.mRowElement.classList.remove('selected');
    }

    containsSelected()
    {
        return this.mRowElement.classList.contains('selected');
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<content-header> connected");
    }

    disconnectedCallback()
    {
        console.log("<content-header> disconnected");
    }
}
 

window.customElements.define('content-header', ContentHeader );

export { ContentHeader };