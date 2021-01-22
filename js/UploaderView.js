import { WCBase, props } from './WCBase.js';
import { ProductView } from './ProductView.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='tab'>
  <div class='tab__headerframe'>
    <div class='tab__header product'>Product
    </div>
    <div class='tab__header recipe'>Recipe
    </div>
  </div>
  <product-view class='view__product'></product-view>
  <recipe-view  class='view__recipe'></recipe-view>
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
        this.mMode = 'product';

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
        .tab__headerframe {
            display: flex;
            width: 100vw;
            height: 48px;
        }
        .tab__header {
            display: flex;
            margin: auto;
            font-weight: 400;
            color: ${props.disabled};
            background: ${props.grey};
        }
        .tab__header.active {
            display: flex;
            margin: auto;
            font-weight: 400;
            color: #fff;
            background: ${props.red};
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

        this.mRootElement = this.shadowRoot.querySelector('.tab');
        this.mProductTab = this.shadowRoot.querySelector('.tab__header.product');
        this.mRecipeTab  = this.shadowRoot.querySelector('.tab__header.recipe');

        this.mProductView = this.shadowRoot.querySelector('.view__product');
        this.mRecipeView  = this.shadowRoot.querySelector('.view__recipe');

        // ----------------------------------------------------------------
        // - Define tab functionality
        // ----------------------------------------------------------------

        this.mProductTab.addEventListener
        (
            "click",
            e => 
            {
                this.openProductView();
            }
        );

        this.mRecipeTab.addEventListener
        (
            "click",
            e => 
            {
                this.openRecipeView();
            }
        );

        if (this.mMode === 'recipe')
        {
            this.openRecipeView();
        }
        else
        {
            this.openProductView();
        }

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

    openProductView()
    {
        //if ( this.mProductView.style.display === 'none')
        //{
            this.mProductView.style.display = 'block';
            this.mRecipeView.style.display  = 'none';
        //}

        this.mProductTab.classList.add('active');
        this.mRecipeTab.classList.remove('active');
    }

    openRecipeView()
    {
        //if ( this.mRecipeView.style.display === 'none')
        //{
            this.mRecipeView.style.display  = 'block';
            this.mProductView.style.display = 'none';
        //}

        this.mRecipeTab.classList.add('active');
        this.mProductTab.classList.remove('active');
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