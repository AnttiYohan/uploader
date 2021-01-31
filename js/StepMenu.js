import { WCBase, props, MEASURE_UNIT_ENUM, STEP_BY_STEP_URL } from './WCBase.js';
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
import { FileCache } from './util/FileCache.js';

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

    setRecipeId(id)
    {
        this.mRecipeId = id;
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
                    this.mRecipeId && this.mRecipeId > 0 &&
                    textInput.value.length &&
                    stepNumberInput.value,
                    file
                )
                {
                    const dataObject =
                    {
                        recipeId: this.mRecipeId,
                        stepNumber: stepNumberInput.value,
                        text: textInput.value
                    };
                    const sbs = { title: 'sbs', data: JSON.stringify(dataObject) }
                    this.addStep
                    (
                        sbs,
                        file
                    ).then(data => {

                        console.log(`Response: ${data}`);
                        this.loadSteps({recipeId: this.mRecipeId});
                        //this.getSteps({recipeId: this.mRecipeId});

                    }).catch(error => {

                        console.log(`error: ${error}`);

                    });
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
     * (Re)creates a list of step row elements
     * 
     * @param {array} list 
     */
    generateList(list)
    {
        deleteChildren(this.mStepList);
        console.log(`generateList steps:${list}`);
        for (const step of list)
        {
            console.log(`generateList step: ${step}`);
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
                console.log(`Delete ${step.id}`);
                this.deleteStep(step.id)
                    .then(data => {

                        console.log(`DELETE recipe/sbs/${step.id} Response: ${data}`);
                        this.loadSteps({recipeId: this.mRecipeId});

                    })
                    .catch(error => {

                        console.log(`DELETE recipe/sbs request error: ${error}`);

                    });
            }
        );

        let stepImage = null;

        try { stepImage = step.image; } catch(error) {}

        const imageElement = newTagClass("img", "editor__image");
        if (stepImage) imageElement.src = `data:${stepImage.fileType};base64,${stepImage.data}`;

        this.mStepList.appendChild
        (
            newTagClassChildren
            (
                "div",
                "editor__gridrow",
                [
                    imageElement,
                    newTagClassHTML("p", "editor__label", `${step.stepNumber}) ${step.text}`),
                    deleteButton
                ]
            )
        );
    }

    // -----------------------------------------------------------------------------
    // -
    // - Calls for cached HTTP Request methods
    // -
    // -----------------------------------------------------------------------------

    /**
     * Uploads the step and closes the editor
     * @param {stepDto} step 
     */
    addStep(step, image)
    {
        console.log(`Add step: ${step.stepNumber}, ${step.text}`);

        return FileCache.postDtoAndImage(STEP_BY_STEP_URL, step, image);
    }

    getSteps(params)
    {
        return FileCache.getCachedWithParams(STEP_BY_STEP_URL, params);
    }

    deleteStep(id)
    {
        return FileCache.delete(STEP_BY_STEP_URL, id);
    }

    // ---------------------------------------------------------------
    // -
    // - HTTP request response handlers
    // -
    // ----------------------------------------------------------------

    loadSteps(params)
    {
        this.getSteps(params)
            .then
            (data => 
            {    
                console.log(`loadSteps - data: ${data}`);
                try 
                {
                    const list = JSON.parse(data);
                    if ( list ) this.generateList(list);
                } 
                catch (error) {}
            })
            .catch(error => { console.log(`Could not read products: ${error}`); });
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("StepMenu::callback connected");
        window.dispatchEvent(new CustomEvent("stepmenuconnected"));
    }

    disconnectedCallback()
    {
        console.log("StepMenu::callback connected");
    }  
}

window.customElements.define('step-menu', StepMenu);

export { StepMenu };