import { WCBase, props } from './WCBase.js';
import 
{ 
    newTagClass,
    newTagClassChildren,
    newTagClassAttrsChildren,
    newTagClassHTML, 
    setImageFileInputThumbnail,
    setImageThumbnail
} from './util/elemfactory.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { NumberInputRow } from './NumberInputRow.js';

/**
 * -------------------------------------
 * Create steps for a recipe
 * -------------------------------------
 * Used on RecipeView
 */
class StepEditor extends WCBase
{
    constructor()
    {
        super();

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='component'>
            <div class='component__row'>
               <p class='component__label'>Steps</p>
            </div>
            <div class='component__row'>
                <div class='frame'>
                    <image-input-row class='step__image'>Image</image-input-row>
                    <text-input-area class='step__content' rows='6'>Text</text-input-area>
                </div>
                <button class='action add'></button>
            </div>
            <div class='component store'>
            </div>
        </div>`);

        this.setupStyle
        (`
        .component__row {
            justify-content: space-between;
        }
        .store .component__row {
            min-height: 64px;
            background-color: #fff;
            border-radius: 8px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 0 8px -3px rgba(0,0,0,0.25);
            margin-bottom: .33em;
        }
        .frame { 
            display: flex;
            flex-basis: 100%;
        }
        .store__field {
            min-width: 64px;
            color: #444;
            font-size: 12px;
            padding: 4px;
            margin-bottom: 2px;
        }
        .store__field.image {
            background-size: cover;
            background-repeat: no-repeat;
            width: 64px;
            height: 64px;
            border: 1px solid rgba(0,0,0,0.25);
            border-radius: 5px;
        }
        .store__field.content {
            width: 100%;
            height: 64px;
        }
        .action {
           cursor: pointer;
           width: 30px;
           height: 30px;
           align-self: center;
           border: 1px solid transparent;
           border-radius: 16px;
           background-color: transparent;
           background-repeat: no-repeat;
           background-position-x: -1px;
           background-size: cover;
       }
       .action:focus,
       .action:active {
           outline: none;
           background-color: #ffffffc0;
           border: 1px solid rgba(50, 0, 88, 0.53);
           box-shadow: 0 0 12px 0px rgba(0, 0, 40, 0.35);
       }
       .action.add {
           background-image: url('assets/icon_plus.svg');
       }
       .action.remove {
           background-image: url('assets/icon_delete_perm.svg');
       }
       `);

        // ---------------------------
        // - Save element references
        // ---------------------------

        const imageInput    = this.shadowRoot.querySelector('.step__image');
        const contentInput  = this.shadowRoot.querySelector('.step__content');

        this.mImageInput = imageInput;
        this.mContentInput = contentInput;
        this.mStore = this.shadowRoot.querySelector('.store');
        this.mTitle = 'Steps';
        this.mKey   = this.hasAttribute('data-input')
                   ? this.getAttribute('data-input')
                   : this.mTitle;

       /**
        * Add button focus
        */
       let addFocus = false;

       /**
        * Create the add button listeners
        */
       const addButton = this.shadowRoot.querySelector('.action.add');
       addButton.addEventListener('click', e => 
       {
           const image   = imageInput.value;
           const content = contentInput.value;

            if ( this.addField( image, content ) )
            {
                imageInput.reset();
                contentInput.reset();
            }
       });
       addButton.addEventListener('focus', e =>
       {
           addFocus = true;
       });
       addButton.addEventListener('blur', e =>
       {
           addFocus = false;
       });
       /**
        * Create top level keyboard listener 
        */
       this.shadowRoot.addEventListener('keydown', e => 
       {
           if (addFocus && e.keyCode === this.ENTER)
           {
                const image   = imageInput.value;
                const content = contentInput.value;
 
                if ( this.addField( image, content ) )  
                {
                    imageInput.reset();
                    contentInput.reset();
                }
           }
       });
        
    }

    /**
     * Returns a list generated from mBuffer map
     * -----------------------------------------
     * @return {Array}
     */
    getStepList()
    {
          const list = [];
          let index = 1;
  
          for (const elem of this.mBuffer)
          {
              const text       = elem.text;
              const stepNumber = index;
              const image      = elem.file;
  
              list.push({ text, stepNumber, image });
  
              index++;
          }
  
          return list;
      }

    get fields()
    {
        const result = [];

        for (const row of this.mStore.children)
        {
            const image   = row.querySelector('.image');
            const content = row.querySelector('.content');

            result.push({image, content});
        }

        return result;
    }  
  
    get value()
    {
        return this.count ? this.fields : undefined;
    }

    object()
    {
        const  result = this.value;

        return result ? {[this.mKey]: result} : result;
    }
  
    /**
     * Return required status
     * ---------------
     * @return {boolean}
     */
    get required()
    {
        return false;
    }

    reset()
    {
        this.mImageInput.reset();
        this.mContentInput.reset();
        deleteChildren( this.mStore );
    }

    /**
     * method stub
     */
    notifyRequired(ensure = true) 
    {
        return '';
    }  

    /**
     * Adds a new field row under the store
     * ---------------------
     * @param {File}   image
     * @param {string} content 
     */
    addField(image, content)
    {
        if ( ! image || ! content ) return false;

        const index  = this.count + 1;
       
        const imageField = newTagClass('div', 'store__field image');
        const contentField = newTagClass('p', 'store__field content');

        // - Setup the thumbnail
        const reader = new FileReader();
        reader.onloadend = (pe) =>
        {
            imageField.style.backgroundImage = `url('${reader.result}')`;
            imageField.style.backgroundSize = `cover`;
        }
        reader.readAsDataURL(image);
 
        // - Setup the content
        contentField.textContent = content;
       
        const button = newTagClass('button', 'action');
        button.classList.add('remove');

        const row = newTagClassChildren
        ('div', 
            'component__row', 
            [ 
                newTagClassChildren('div', 'frame', [ imageField, contentField ]),
                button 
            ]
        );

        button.dataset.row = `${index}`;
        button.addEventListener('click', e =>
        {
            row.remove();
        });
  
        this.mStore.appendChild( row );
        
        return true;
    }
  
    /**
     * Adds a new step into the step editor
     * ------------------------------------
     * @param {String} text 
     * @param {Number} number 
     * @param {File}   file 
     */
    addStep(text, file)
    {
        console.log(`AddStep file: ${file}`);

        this.mBuffer.push({text, file});
        const number = this.mBuffer.length;

        const deleteButton = newTagClass("div", "editor__button--delete");
        const imageElement = newTagClass("img", "editor__image");
        //imageElement.src = file;
        setImageThumbnail(imageElement, file);

        const stepRowElement = newTagClassAttrsChildren
        (
            'div',
            'editor__gridrow',
            {
                'data-number': `${number}`
            },
            [
                imageElement,
                newTagClassHTML("p", "editor__label step_text", `${text}`),
                deleteButton
            ]
        )

        deleteButton.addEventListener
        (
            'click',
            e =>
            {
                console.log(`Delete ${number}`);
                stepRowElement.remove();

                // --------------------------------
                // - Delete the buffer element with
                // - The number
                // --------------------------------
                
                this.mBuffer.splice(number - 1, 1);
            }
        );



        this.mStepList.appendChild(stepRowElement);


        //this.mFileList.push({id:number, file});
    }

   
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("StepEditor::callback connected");
    }

    disconnectedCallback()
    {
        console.log("StepEditor -- disconnected");
    }  
}

window.customElements.define('step-editor', StepEditor);

export { StepEditor };