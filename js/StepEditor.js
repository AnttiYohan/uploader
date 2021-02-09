import { WCBase, props } from './WCBase.js';
import 
{ 
    newTagClass,
    newTagClassAttrsChildren,
    newTagClassHTML, 
    setImageFileInputThumbnail,
    setImageThumbnail
} from './util/elemfactory.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='step-editor'>
  <div class='editor__rowset'>
    <h3  class='editor__subheader'>Steps</h3>
  </div>

  <!-- STEP EDITOR -->

  <div class='editor__frame step_editor'>
    <div class='editor__rowset'>
      <label class='editor__label'>Text</label>
      <input class='editor__input step_text' type='text'>
    </div>
    <div class='editor__rowset'>
      <label class='editor__label'>Number</label>
      <input class='editor__input step_number' type='number' min='1' default='1'>
    </div>
    <div class='editor__rowset'>
      <img   class='editor__image step_image' src='assets/icon_placeholder.svg'>
      <div   class='uploader__fileframe'>
        <label class='uploader__filelabel' for='image-upload-input'>image upload</label>
        <input class='uploader__file step_file' type='file' id='image-upload-input'>
      </div>
    </div>
    <div class='editor__rowset'>
      <label  class='editor__label'>Add step</label>
      <button class='editor__button--new add_step'></button>
    </div>
  </div>

  <!-- Display the exsisting steps here -->

  <div class='editor__frame step_list'>
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
        (`* {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
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
        .editor__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
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
            background-image: url('assets/icon_publish.svg');
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
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        const stepTextInput   = this.shadowRoot.querySelector('.editor__input.step_text');
        const stepNumberInput = this.shadowRoot.querySelector('.editor__input.step_number');
        const stepFileInput   = this.shadowRoot.querySelector('.uploader__file.step_file');
        const stepImage       = this.shadowRoot.querySelector('.editor__image.step_image');

        setImageFileInputThumbnail( stepFileInput, stepImage );

        this.mStepList      = this.shadowRoot.querySelector('.editor__frame.step_list');
        this.mAddStepButton = this.shadowRoot.querySelector('.editor__button--new.add_step');
        this.mAddStepButton.addEventListener
        ("click", e => 
        {
            const text   = stepTextInput.value;
            const number = stepNumberInput.value;

            let file = null;

            if ('files' in stepFileInput && stepFileInput.files.length)
            {
                file = stepFileInput.files[0];
            }

            if (text.length && number > 0 && file)
            {
                this.addStep(text, number, file);
                stepTextInput.value = '';
                stepNumberInput.value = '';
                delete stepFileInput.files;
                stepImage.src = 'assets/icon_placeholder.svg';
            }
        });

    }


    addStep(text, number, file)
    {
        console.log(`AddStep file: ${file}`);

        const deleteButton = newTagClass("div", "editor__button--delete");

        const imageElement = newTagClass("img", "editor__image");
        imageElement.src = file;

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
            "click",
            e =>
            {
                console.log(`Delete ${number}`);
                stepRowElement.remove();
            }
        );



        this.mStepList.appendChild(stepRowElement);

        //this.mFileList.push({id:number, file});
    }

    getStepList()
    {
        for (const row of this.mStepList.children)
        {
            const number = row.getAttribute('data-number');
            console.log(`Row data-number: ${number}`);

            const textLabel = row.querySelector('.editor__label.step_text');
            const text = textLabel.textContent;
            console.log(`textlabel text: ${text}`);
        }
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