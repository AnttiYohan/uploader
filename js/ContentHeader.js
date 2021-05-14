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

        /**
         * Build the button set
         */
        let html = '';
        let index = 1;

        for (const obj of this.mActions)
        {
            const iconUrl = obj.iconUrl;
            
            html += `<button class='action n${index}' style='background-image:url("${iconUrl}");'></button>
            `;

            index++;
        }

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component__row'>
              <p class='title'>${this.mTitle}</p>
              ${html}
              <button class='action remove'></button>
            </div>
        `);
        
        this.setupStyle
         (`.action {
            width: 28px;
            height: 28px;
            background-repeat: no-repeat;
            background-size: cover;
            border: 2px solid transparent;
         }
        .action:hover {
            width: 24px;
            height: 24px;
            border: 4px solid transparent;
        }
        .action:focus {
            border: 2px solid rgba(255,80,80,0.5);
            outline: none;
        }
        .action:active {
            outline: none;
            border: 2px solid rgba(0, 0, 0, 0.5);
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
         }
        .title {
            font-size: 14px;
            color: #444;
            min-width: 100%;
            text-align: middle;
        }
        .component__row.selected {
            background-color: rgba(0,0,0,0.75);
        }
        .component__row.selected .title {
            color: #fff;
        }
        `);

        /**
         * Create the action button listeners 
         */
        index = 0;
        const buttons = this.shadowRoot.querySelectorAll('.component__row .action:not(.remove)');
        for (const button of buttons)
        {
            button.addEventListener('click', e => 
            {
                const action = this.mActions[index];
                this.emit(action.type, action.detail);
            });

            index++;
        }

        /**
         * Create the remove button listener
         */
        const removeButton = this.shadowRoot.querySelector('.action.remove');
        removeButton.addEventListener('click', e =>
        {
            const msg =
            {
                'title' : this.mTitle,
                'index' : this.mRowIndex
            };

            this.emit('header-removed', msg);

            /* Self destruct */
            this.remove();
        });

        /**
         * The Content Header wrapper element
         * @member {HTMLDivElement} mRowElement
         * -------
         */
         this.mRowElement = this.shadowRoot.querySelector('.component__row');

         const label = this.shadowRoot.querySelector('.title');
         label.addEventListener('click', e =>
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