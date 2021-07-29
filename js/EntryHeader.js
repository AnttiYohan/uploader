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

        this.mKey = options.hasOwnProperty('key')
                  ? options.key
                  : 'unique';
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

        this.mEditable = options.hasOwnProperty('editable')
                    ? options.editable
                    : false;
        /**
         * Create an edit button when editable is true in the options
         */
        const html = this.mEditable
                   ? `<button class='action edit'></button>`
                   : '';
   
        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component__row'>
              <div class='frame'>
                <img src='' class='thumbnail'/>
                <h4 class='component__title'>${this.mTitle}</h4>
              </div>
              <div class='frame'>
                ${html}
                <button class='action remove'></button>
              </div>
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
            margin-left: 4px;
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
            cursor: pointer;
            border-radius: 8px;
            border: 2px solid rgba(0,0,0,0.15);
            object-fit: cover;
            object-position: center;
            width: 32px;
            height: 32px;
            padding: 3px;
            transition: border-color .3s;
        }
        .thumbnail:hover {
            border-color: rgba(128,0,0,0.5);
        }
        .component__row {
            height: 40px;
            border: 2px solid transparent;
            border-radius: 6px;
            justify-content: space-between;
            align-items: center;
            transition: border-color .3s;
        }
        .component__title {
            width: 100%;
            font-size: 14px;
            color: #444;
            text-align: middle;
            margin-left: 1em;
            transition: transform .5s ease-in-out;
        }
        .component__field {
            min-width: 48px;
        }
        .component__row.selected {
            border-color: rgba(0,0,0,0.5);
        }
        .component__row.selected .component__title {
            transform: scale3d(1.05,1.05,1.05);
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

            this.emit('header-remove', msg);

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

        
        imgElem.addEventListener('click', e =>
        {
            this.shadowRoot.dispatchEvent
             (
                 new CustomEvent('entry-header-click', 
                 {
                     bubbles: true,
                     composed: true,
                     detail: 
                     {
                        'title': this.mTitle
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

        /**
         * Create the edit button listener
         * When item is editable
         */
        if ( this.mEditable )
        {
            const editButton = this.shadowRoot.querySelector('.action.edit');

            editButton.addEventListener( 'click', e => 
            {
                const msg =
                {
                    'title' : this.mTitle
                };
    
                this.emit( 'header-edit', msg );
    
            });
        }
         
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