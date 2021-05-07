import { WCBase, props } from './WCBase.js';
import 
{ 
    newTagClass,
    newTagClassAttrsChildren,
    newTagClassHTML, 
    setImageFileInputThumbnail,
    setImageThumbnail
} from './util/elemfactory.js';
import { TextInputRow } from './TextInputRow.js';
import { ImageInputRow } from './ImageInputRow.js';
import { NumberInputRow } from './NumberInputRow.js';
 

const 
template = document.createElement("template");
template.innerHTML =
`<div class='step-editor'>
    <div class='component__row'>
        <p class='component__label'>Steps</p>
    </div>

  <!-- STEP EDITOR -->

  <div class='editor__frame step_editor'>
   

    <!-- STEP NUMBER INPUT -->

    <!-- number-input-row class='step_number'>Number</number-input-row -->

    <!-- STEP INPUTS -->
    <div class='editor__rowset'>
      <image-input-row class='step_image'>Image</image-input-row>
      <text-input-area class='step_text' rows='6'>Text</text-input-area>
      <div class='editor__button--plus add_step'></div>
    </div>

  </div>

  <!-- Display the exsisting steps here -->

  <div class='editor__frame step_list hz-divider'>
  </div>

</div>`;

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
        this.setupStyle
        (`
        :host {
            margin-top: 16px !important;
            border: 4px solid rgba(0,0,0,0.25);
            padding: 8px;
        }
        * {
            font-family: 'Baskerville Normal';
        }
        .clickable {
            cursor: pointer;
        }
        .zoomable {
            transition: transform .15s ease-in-out;
        }
        .zoomable:hover {
            transform: scale3D(1.1, 1.1, 1.1);
        }
        .editor__frame {
            display: flex;
            flex-direction: column;
        }
        .component__row {
            display: flex;
            padding: 4px;
        }
        .component__label {
            font-size: 14px;
            color: #222;
            font-weight: 200;
            padding: 0;    
        }
        .editor__rowset {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__gridrow {
            display: grid;
            grid-template-columns: 48px auto 48px;
            height: 48px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__image {
            width: ${props.thumbnail_side};
            height: ${props.thumbnail_side};
            border-radius: 4px;
            box-shadow: 0 1px 15px 0px rgba(0,0,0,0.25);
            align-self: center;
            justify-self: center;
        }
        .editor__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            align-self: center;
            padding-left: 4px;
        }
        .editor__input {
            padding: 4px;
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            background-color: transparent;
            outline: none;
            border-bottom: 2px solid ${props.grey};
            height: ${props.lineHeight};
        }
        .editor__button--plus {
            cursor: pointer;
            margin-top: 16px;
            width: 32px;
            height: 32px;
            background-image: url('assets/icon_plus.svg');
            background-repeat: no-repeat;
            background-size: 32px;
        }
        .editor__button {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.green};
            background-image: url('assets/icon_update.svg');
        }
        .editor__button--new {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            background-color: ${props.blue};
            background-image: url('assets/icon_add_circle.svg');
        }
        .editor__button--save {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_save.svg');
        }
        .editor__button--delete {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_cancel.svg');
            align-self: center;
            justify-self: center;
        }
        .editor__subheader {
            font-size: ${props.header_font_size};
            font-weight: 500;
            align-self: center;
        }
        .uploader__fileframe {
            position: relative;
        }
        .uploader__file {
            position: absolute;
            appereance: none;
            z-index: -1;
            opacity: 0;
        }
        .uploader__filelabel {
            display: inline-block;
            cursor: pointer;
            border-radius: 4px;
            background-color: ${props.green};
            background-image: url( 'assets/icon_publish.svg' );
            background-repeat: no-repeat;
            background-position-x: right;
            padding: 5px 0 0 0;
            border: 2px solid rgba(0, 0, 0, 0.33);
            width: 153px;
            height: 32px;
            color: #fff;
            font-size: ${props.header_font_size};
            font-weight: 500;
            text-align: center;
            text-shadow: 0 0 2px #000;
            box-shadow: 0 1px 7px 1px rgba(0,0,0,0.25);
        }
        .hz-divider {
            border-top: 1px solid ${props.darkgrey};
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        const stepTextInput   = this.shadowRoot.querySelector('.step_text');
        const stepImageInput  = this.shadowRoot.querySelector('.step_image');

        // ---------------------------
        // - Define an step buffer
        // ---------------------------

        this.mBuffer = [];

        this.mStepList      = this.shadowRoot.querySelector('.editor__frame.step_list');
        this.mAddStepButton = this.shadowRoot.querySelector('.add_step');
        this.mAddStepButton.addEventListener('click', e => 
        {
            // ----------------------------------
            // - Grab the values from the inputs
            // - And validate them
            // ----------------------------------

            const text   = stepTextInput.value;
            const image  = stepImageInput.value;

            if (! text.length || ! image)
            {
                console.log(`All step data, text, number and image, has to be set`);
                return;
            }

            // ------------------------------
            // - Add the new step
            // ------------------------------

            this.addStep(text, image);

            // ------------------------------
            // - Lastly, Reset the inputs
            // ------------------------------

            stepTextInput.reset();
            stepImageInput.reset();

        });

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

    /**
     * Returns a list generated from mBuffer map
     * -----------------------------------------
     * @return {Array}
     */
    getStepList()
    {
        const list = [];

        console.log(`Parsing the step list`);
        let index = 1;

        for (const elem of this.mBuffer)
        {
            console.log(`Step key ${key}`)

            const text       = elem.text;
            const stepNumber = index;
            const image      = elem.file;

            console.log(`Text: ${text}, number: ${stepNumber}`);

            list.push({ text, stepNumber, image });

            index++;
        }

        return list;
     
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("StepEditor::callback connected");
        this.dispatchEvent(new CustomEvent("stepeditorconnected", { bubbles: true }));
    }

    disconnectedCallback()
    {
        console.log("StepEditor -- disconnected");
    }  
}

window.customElements.define('step-editor', StepEditor);

export { StepEditor };