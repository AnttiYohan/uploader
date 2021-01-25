import { WCBase, props, MEASURE_UNIT_ENUM } from './WCBase.js';
import 
{ 
    newTagClass,
    newTagClassAttrs,
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    setSelectedIndex, 
    inputClassValue, 
    numberInputClass,
    numberInputClassValue,
    fileInputClass,
    selectClassIdOptionList,
    setImageFileInputThumbnail
} from './util/elemfactory.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='productmenu'>
  <div class='editor__rowset'>
    <h3  class='editor__subheader'>Steps</h3>
    <button class='editor__button--new new_recipe_step'></button>
  </div>

 <!-- Build the new step here -->

  <div class='editor__frame step_editor'>
  </div>

  <!-- Display the exsisting steps here -->

  <div class='editor__frame step_list'>
  </div>


</div>`;

/**
 * -------------------------------------
 * Menu that display recipe steps
 * -------------------------------------
 * Used on RecipeEditor
 */
class StepMenu extends WCBase
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
            margin: 16px auto;
            max-width: 600px;
        }
        .editor__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: ${props.lineHeight};
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
            color: #fff;
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
        }
        .editor__image {
            width: 32px;
            height: 32px;
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mStepEditor    = this.shadowRoot.querySelector('.editor__frame.step_editor');
        this.mStepList      = this.shadowRoot.querySelector('.editor__frame.step_list');
        this.mNewStepButton = this.shadowRoot.querySelector('.editor__button--new.new_recipe_step');
        this.mNewStepButton.addEventListener("click", e => { this.openStepEditor()});

    }

    /**
     * -------------------------
     * Opens the New Step Editor
     * -------------------------
     */
    openStepEditor()
    {
        // -----------------------------
        // - Text row
        // -----------------------------

        const textInput = inputClassValue("editor__input", "text");

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__rowset",
                [
                    newTagClassHTML("p", "editor__label", "Text"),
                    textInput
                ]
            )
        );

        // -----------------------------
        // - Step number row
        // -----------------------------

        const stepNumberInput = numberInputClass("editor__input");

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__rowset",
                [
                    newTagClassHTML("p", "editor__label", "Step number"),
                    stepNumberInput
                ]
            )
        );

        // -----------------------------
        // - Image row
        // -----------------------------

        const imageElement = newTagClass("img", "editor__image");
        const imageFileInput = fileInputClass("editor__input");

        setImageFileInputThumbnail(imageFileInput, imageElement);
                
        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__rowset",
                [
                    imageElement,
                    imageFileInput
                ]
            )
        );

        // -----------------------------
        // - Add step row
        // -----------------------------

        const 
        addStepButton = newTagClass("button", "editor__button--save");
        addStepButton.addEventListener
        (
            "click",
            e => 
            {
                // -----------------------------
                // - Validate inputs
                // -----------------------------
                let file = null;

                if ('files' in imageFileInput && imageFileInput.files.length)
                {
                    file = imageFileInput.files[0];
                }

                if 
                ( 
                    textInput.value.length &&
                    stepNumberInput.value,
                    file
                )
                {
                    this.addStep
                    (
                        {
                            stepNumber: stepNumberInput.value,
                            text: textInput.value,
                            image: file
                        }
                    );
                }
            }
        );

        this.mStepEditor.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__rowset",
                [
                    newTagClassHTML("p", "editor__label", "Add step"),
                    addStepButton
                ]
            )
        );

    }

    /**
     * Uploads the step and closes the editor
     * @param {stepDto} step 
     */
    addStep(step)
    {
        console.log(`Add step: ${step.stepNumber}, ${step.text}`);
        this.setupStepList([step]);
        deleteChildren(this.mStepEditor);
    }

    /**
     * (Re)creates a list of step row elements
     * 
     * @param {array} list 
     */
    setupStepList(list)
    {
        deleteChildren(this.mStepList);

        for (const step in list)
        {
            this.addStepRow(step);
        }
    }

    /**
     * Creates a row in the step list element
     * 
     * @param {stepDto} step 
     */
    addStepRow(step)
    {
        const 
        deleteButton = newTagClass("div", "editor__button--delete");
        deleteButton.addEventListener
        (
            "click",
            e =>
            {
                console.log(`Delete ${step.text}`);
            }
        );

        const 
        imageElement = newTagClass("img", "editor__image");
        imageElement.src = step.image;

        this.mStepList.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__rowset",
                [
                    deleteButton,
                    imageElement,
                    newTagClassHTML("p", "editor__label", `${step.stepNumber}: ${step.text}`)
                ]
            )
        );
    }

    // ----------------------------------------------
    // - Update method section
    // ----------------------------------------------



}

window.customElements.define('step-menu', StepMenu);

export { StepMenu };