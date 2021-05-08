import { WCBase, props } from './WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail, newTagClassAttrs } from './util/elemfactory.js';


/**
 * One text input, and an add button.
 * The button adds the input content in a new
 * row below the bottom.
 * There is also a button with the lower rows,
 * But here it removes the row it is on.
 * There may be as many of these added rows
 * as one wants to create
 * 
 * ======================================== 
 */
class MultiEntryRow extends WCBase
{
    constructor()
    {
        super();

  
        /**
         * Required flag
         * ---------
         * @property {boolean} mRequired
         */
        this.mRequired = this.hasAttribute('required') ? true : false;


        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
              <div class='component__label${this.mRequired ? " required" : ""}'><slot></div>
            </div>
            <div class='component__row'>
                <input type='text' class='component__input'>
                <button class='action add'></button>
            </div>
            <div class='store'>
            </div>
          </div>`);

        
        this.setupStyle
         (`.store__field {
             width: 100%;
             color: #444;
             font-size: 12px;
             padding: 4px;
             background-color: #ffffff;
             border: 1px solid rgba(0,0,0,0.25);
             margin-bottom: 2px;
             border-radius: 5px;
         }
         .action {
            cursor: pointer;
            width: 32px;
            height: 32px;
            background-color: transparent;
            background-repeat: no-repeat;
            background-size: cover;
            box-shadow: 0 0 12px -5px rgba(0, 0, 0, 0.25);
        }
        .action.add {
            background-image: url('assets/icon_plus.svg');
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
        }
        `);

        this.mStore = this.shadowRoot.querySelector('.store'); 
        this.mInput = this.shadowRoot.querySelector('.component__input');
     
        /**
         * Create the remove button listener
         */
        const addButton = this.shadowRoot.querySelector('.action.add');
        addButton.addEventListener('click', e =>
        {
            const value = this.mInput.value;

            if (value.length)
            {
                this.addField(value);
            }
        });

    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------

    get fields()
    {
        const result = [];

        for (const row of this.mStore.children)
        {
            const field = row.querySelector('.store__field');
            result.push(field.textContent);
        }

        return result;
    }

    get count()
    {
        return this.mStore.children.length;
    }

    /**
     * Adds a new field row under the store
     * ---------------------
     * @param {string} entry 
     */
    addField(entry)
    {
        const index  = this.count + 1;
        const field  = newTagClassAttrs('p', 'store__field', { 'data-field': index });
        field.textContent = entry;

        const button = newTagClass('button', 'action');
        button.classList.add('remove');

        const row    = newTagClassChildren
        ('div', 'component__row',
            [
                field,
                button
            ]
        );

        button.dataset.row = `${index}`;
        button.addEventListener('click', e =>
        {
            row.remove();
        });

        this.mStore.appendChild( row );
    }

    reset()
    {
        this.mInput.value = '';
        deleteChildren( this.mStore );
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<multi-entry-row> connected");
    }

    disconnectedCallback()
    {
        console.log("<multi-entry-row> disconnected");
    }
}
 

window.customElements.define('multi-entry-row', MultiEntryRow );

export { MultiEntryRow };