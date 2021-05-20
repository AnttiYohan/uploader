import { WCBase, props } from './WCBase.js';

/**
 * EntryHeader consists of a row with:
 * 1) Title on the left/upper
 * 2) Text fields after title, in the row
 * 3) Action Buttons, last on the rightmost side
 * -------------------------------------------------
 * : Title : field-1 : field-2       : Btn  : Btn  :
 * :  IMG  :   ---   :  ---          :  #1  :  #2  :
 * --------------------------------------------------
 * @emits   entry-header-clicked
 * @emits   element-removed
 * ======================================== 
 */
class EntryHeader extends WCBase
{
    constructor(options = {})
    {
        super();

        /**
         * The title of the content
         * ---------
         * @property {string} mTitle
         */
        this.mTitle = options.hasOwnProperty('title') 
                    ? options.title 
                    : '';

        /**
         * The fields of the content
         * ---------
         * @property {string} mFields
         */
        this.mFields = options.hasOwnProperty('fields') 
                     ? options.fields 
                     : [];

        /**
         * Actions for the header, action object includes:
         * 1) Event type that should emit when action is clicked
         * 2) Event detail that should be included in the event
         * 3) Action button icon url
         * -------------------------
         */
        this.mActions = options.hasOwnProperty('actions') 
                      ? options.actions 
                      : [];


        const thumbnail = options.hasOwnProperty('thumbnail')
                    ? options.thumbnail
                    : undefined;

        /**
         * Build the button set
         */
        let fields = '';

        for (const field of this.mFields)
        {
            fields += `<p class='component__field'>${field}</p>`;
        }

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
              <img src='' class='thumbnail'/>
              <h4 class='component__title'>${this.mTitle}
              </h4>
              ${fields}
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
        .thumbnail {
            border-radius: 4px;
            border: 1px solid #fff;
            object-fit: cover;
            object-position: center;
            width: 48px;
            height: 48px;
            padding: 4px;
        }
        .component__row {
            height: 48px;
        }
        .component__title {
            font-size: 14px;
            color: #444;
            text-align: middle;
        }
        .component__field {
            min-width: 48px;
        }
        .component__row.selected {
            background-color: rgba(0,0,0,0.75);
        }
        .component__row.selected .title {
            color: #fff;
        }
        `);

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
            //this.remove();
        });

        /**
         * The Content Header wrapper element
         * @member {HTMLDivElement} mRowElement
         * -------
         */
         this.mRowElement = this.shadowRoot.querySelector('.component__row');

         const imgElem = this.shadowRoot.querySelector('.thumbnail');
         const label = this.shadowRoot.querySelector('.component__title');

        /** Set thumbnail as background */
        if (thumbnail)
        {
            imgElem.src = thumbnail;
        }

        /*
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
         });*/

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
        console.log("<entry-header> connected");
    }

    disconnectedCallback()
    {
        console.log("<entry-header> disconnected");
    }
}
 

window.customElements.define('entry-header', EntryHeader );

export { EntryHeader };