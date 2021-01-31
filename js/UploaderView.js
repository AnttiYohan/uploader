import { WCBase, props } from './WCBase.js';
import { ProductView } from './ProductView.js';
import { RecipeView } from './RecipeView.js';
import { LoginView } from './LoginView.js';
import { FileCache } from './util/FileCache.js';
import { deleteChildren } from './util/elemfactory.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
 
   <!-- The admin bar in the header -->

  <header class='uploader__adminframe'>
    <div class='uploader__adminbar'>
      <div class='uploader__tabframe'>
        <img class='uploader__logo' src='assets/logo-small.png' />
        <div class='uploader__tab product'>Product</div>
        <div class='uploader__tab recipe'>Recipe</div>
      </div>
      <div class='uploader__logout zoomable'></div>
    </div> 
  </header>
  
  <product-view class='view__product'></product-view>
  <recipe-view  class='view__recipe'></recipe-view>

</div>`;

/**
 * 
 */
class UploaderView extends WCBase
{
    constructor(token)
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        console.log(`Token: ${token}`);

        this.mToken     = token;
        this.mDisplay   = 'flex';
        this.mMode      = 'login';

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
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 0;
            height: fit-content;
        }
        .uploader__adminframe {
            width: 100vw;
            background-color: ${props.admin_bar_bg};
            height: ${props.admin_bar_height};
            border-bottom: 1px solid rgba(0,0,0,0.33);
        }
        .uploader__adminbar {
            display: flex;
            justify-content: space-around;
            margin: 0 auto;
            max-width: ${props.uploader_max_width};
        }
        .uploader__logo {
            height: 46px;
            width: auto;
            margin: 1px 0;
        }
        .uploader__logout {
            cursor: pointer;
            margin: 8px;
            width: ${props.button_side};
            height: ${props.button_side};
            background-image: url('assets/icon_logout.svg');
        }
        .uploader__tabframe {
            display: flex;
            flex-direction: row;
        }
        .uploader__tab {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            font-weight: 400;
            color: ${props.disabled};
            background: ${props.grey};
            margin-bottom: 1px;
            border-left: 1px solid ${props.darkgrey};
        }
        .uploader__tab.active {
            padding: 8px;
            font-weight: 400;
            color: #fff;
            background: ${props.red};
        }
        .uploader__tab:first-of-type {
            //border-right: 1px solid rgba(255,255,255,0.5);
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

        this.mRootElement   = this.shadowRoot.querySelector('.uploader');
        //this.mHeaderFrame   = this.shadowRoot.querySelector('.uploader__adminbar');

        this.mLogoutButton  = this.shadowRoot.querySelector('.uploader__logout');
        this.mProductTab    = this.shadowRoot.querySelector('.uploader__tab.product');
        this.mRecipeTab     = this.shadowRoot.querySelector('.uploader__tab.recipe');

        this.mProductView   = this.shadowRoot.querySelector('.view__product');
        this.mRecipeView    = this.shadowRoot.querySelector('.view__recipe');

        // ----------------------------------------------------------------
        // - Define tab functionality
        // ----------------------------------------------------------------

        this.mLogoutButton.addEventListener
        (
            "click",
            e =>
            {
                FileCache.clearToken();
                localStorage.removeItem('token');
                deleteChildren(document.body);
                document.body.appendChild(new LoginView());
                this.remove();
                return;
            }
        );

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