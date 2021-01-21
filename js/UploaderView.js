import { WCBase, props } from './WCBase.js';
import { ProductView } from './ProductView.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
  <product-view></product-view>
</div>`;

/**
 * 
 */
class UploaderView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mToken = '';
        this.mDisplay = 'flex';

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
        .uploader {
            display: ${this.mDisplay};
            flex-direction: column;
            margin: 16px auto;
            max-width: 1400px;
            height: fit-content;
        }
        .uploader__button {
            margin-top: 16px;
            font-weight: 200;
            height: ${props.lineHeight};
            color: ${props.buttonColor};
            background-color: ${props.buttonBg};
        }
        .uploader__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        this.mRecipeButton = this.shadowRoot.querySelector('.uploader__button');

        // ----------------------------------------------------------------
        // - Define event listeners to listen for LoginView's custom events
        // ----------------------------------------------------------------

        window.addEventListener
        (
            "login-event", 
            e =>
            {
                console.log(`UploaderView - login-event catched`);

                // ----------------------------------
                // - Grab the token from local store
                // ----------------------------------

                this.mToken = localStorage.getItem('token');

                // ----------------------------------
                // - Turn the root element display on
                // ----------------------------------

                this.mRootElement.style.display = 'flex';
            },
            true
        );

        // ---------------------------
        // - Setup login functionality
        // ---------------------------


    }

    checkLoginStatus()
    {

    }

    // ---------------------------------------------
    // - HTTP Request methods
    // - --------------------
    // - (1) getRecipes
    // - (2) addRecipe
    // - (3) addStepByStep
    // - (4) updateStepByStep
    // - (5) removeStepByStep
    // ----------------------------------------------
    

  
}

window.customElements.define('uploader-view', UploaderView);

export { UploaderView };