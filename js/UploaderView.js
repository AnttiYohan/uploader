import { deleteChildren, newTagChild } from './util/elemfactory.js';
import { WCBase, props } from './WCBase.js';
import { EmulatorView } from './emulator-components/EmulatorView.js';
import { ArticleView } from './ArticleView.js';
import { ProductView } from './ProductView.js';
import { RecipeView } from './RecipeView.js';
import { AdminView } from './AdminView.js';
import { LoginView } from './LoginView.js';
import { FileCache } from './util/FileCache.js';

const 
template = document.createElement("template");
template.innerHTML =
`<link rel='stylesheet' href='assets/css/components.css'>
 <div class='root'>
 
   <!-- The admin bar in the header -->

  <header class='nav'>
    <div class='nav__limiter'>
      <div class='nav__logo'></div>
      <div class='nav__tablist'>
        <div class='nav__tab admin'>Admin</div>
        <div class='nav__tab article'>Article</div>
        <div class='nav__tab product'>Product</div>
        <div class='nav__tab recipe'>Recipe</div>
        <div class='nav__tab emulator'>Emulator</div>
      </div>
      <div class='nav__logout zoomable'></div> 
    </div>
  </header>
  
  <admin-view    class='view--admin'   ></admin-view>
  <article-view  class='view--article' ></article-view>
  <product-view  class='view__product' ></product-view>
  <recipe-view   class='view__recipe'  ></recipe-view>
  <emulator-view class='view--emulator'></emulator-view>

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
        .root {
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 0;
            height: 100%;
            background-image: url('assets/background-mesh.png');
            background-repeat: repeat;
        }
        .nav {
            background-color: #fff;
            border-bottom: 1px solid rgba(0,0,0,0.33);
        }
        .nav__limiter {
            max-width: 1700px;
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
        }
        .nav__logo {
            width: 96px;
            background-image: url( 'assets/logo-small.png' );
            background-repeat: no-repeat;
            background-position-x: left;
            background-size: contain;
        }
        .nav__tablist {
            display: flex;
            flex-direction: row;
        }
        .nav__tab {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            font-weight: 400;
            color: ${props.disabled};
            margin-bottom: 1px;
        }
        .nav__tab.active {
            padding: 8px;
            font-weight: 400;
            color: ${props.red};
            text-shadow: 0 3px 5px rgba(0,0,0,0.33);
        }
        .nav__logout {
            cursor: pointer;
            margin: 8px;
            width: 96px;
            height: ${props.button_side};
            background-image: url('assets/icon_logout.svg');
            background-repeat: no-repeat;
            background-position-x: right;
        }
        @media (max-width: 500px)
        {
            .nav__tablist  {
                flex-direction: column;
            }
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement   = this.shadowRoot.querySelector('.root');
       
        this.mLogoutButton  = this.shadowRoot.querySelector('.nav__logout');
        this.mArticleTab    = this.shadowRoot.querySelector('.nav__tab.article');
        this.mProductTab    = this.shadowRoot.querySelector('.nav__tab.product');
        this.mRecipeTab     = this.shadowRoot.querySelector('.nav__tab.recipe');
        this.mAdminTab      = this.shadowRoot.querySelector('.nav__tab.admin');
        this.mEmulatorTab   = this.shadowRoot.querySelector('.nav__tab.emulator');

        this.mAdminView     = this.shadowRoot.querySelector('.view--admin');
        this.mArticleView   = this.shadowRoot.querySelector('.view--article');
        this.mProductView   = this.shadowRoot.querySelector('.view__product');
        this.mRecipeView    = this.shadowRoot.querySelector('.view__recipe');
        this.mEmulatorView  = this.shadowRoot.querySelector('.view--emulator');

        // ----------------------------------------------------------------
        // - Define tab functionalitylpijd
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

        /**
         * Tab click listeners
         */
        this.mAdminTab.addEventListener( 'click', e => 
        {
            this.openAdminView();
        });
        
        this.mArticleTab.addEventListener( 'click', e => 
        {
            this.openArticleView();
        });

        this.mProductTab.addEventListener( 'click', e => 
        {
            this.openProductView();
        });

        this.mRecipeTab.addEventListener( 'click', e => 
        {
            this.openRecipeView();
        });

        this.mEmulatorTab.addEventListener( 'click', e => 
        {
            this.openEmulatorView();
        });

        /**
         * Initial view opening
         */
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

        window.addEventListener( 'login-event', e =>
        {
            console.log(`UploaderView - login-event catched`);
            this.mToken = localStorage.getItem('token');
        }, true );

        // ---------------------------
        // - Setup login functionality
        // ---------------------------


    }

    /**
     * Perform logout
     */
    logout()
    {
        FileCache.clearToken();
        deleteChildren(document.body);
        document.body.appendChild(new LoginView());
        this.remove();
    }

    openAdminView()
    {
        this.mAdminView.style.display    = 'block';
        this.mArticleView.style.display  = 'none';
        this.mProductView.style.display  = 'none';
        this.mRecipeView.style.display   = 'none';
        this.mEmulatorView.style.display = 'none';
    
        this.mArticleTab.classList.remove('active');
        this.mProductTab.classList.remove('active');
        this.mEmulatorTab.classList.remove('active');
        this.mRecipeTab.classList.remove('active');
        this.mAdminTab.classList.add('active');
    }
    openArticleView()
    {
        this.mAdminView.style.display    = 'none';
        this.mArticleView.style.display  = 'block';
        this.mProductView.style.display  = 'none';
        this.mRecipeView.style.display   = 'none';
        this.mEmulatorView.style.display = 'none';
    
        this.mArticleTab.classList.add('active');
        this.mProductTab.classList.remove('active');
        this.mEmulatorTab.classList.remove('active');
        this.mRecipeTab.classList.remove('active');
        this.mAdminTab.classList.remove('active');
    }

    openProductView()
    {
        this.mAdminView.style.display    = 'none';
        this.mArticleView.style.display  = 'none';
        this.mProductView.style.display  = 'block';
        this.mRecipeView.style.display   = 'none';
        this.mEmulatorView.style.display = 'none';
    
        this.mArticleTab.classList.remove('active');
        this.mProductTab.classList.add('active');
        this.mEmulatorTab.classList.remove('active');
        this.mRecipeTab.classList.remove('active');
        this.mAdminTab.classList.remove('active');
    }

    openRecipeView()
    {
        /**
         * Adjust views
         */
        this.mAdminView.style.display    = 'none';
        this.mArticleView.style.display   = 'none';
        this.mRecipeView.style.display    = 'block';
        this.mProductView.style.display   = 'none';
        this.mEmulatorView.style.display  = 'none';

        /**
         * Adjust tabs' classlists
         */
        this.mArticleTab.classList.remove('active');
        this.mRecipeTab.classList.add('active');
        this.mProductTab.classList.remove('active');
        this.mEmulatorTab.classList.remove('active');
        this.mAdminTab.classList.remove('active');

    }

    openEmulatorView()
    {
        /**
         * Adjust views
         */
        this.mAdminView.style.display    = 'none';
        this.mArticleView.style.display  = 'none';
        this.mEmulatorView.style.display = 'block';
        this.mRecipeView.style.display   = 'none';
        this.mProductView.style.display  = 'none';

        /**
         * Adjust tabs' classlists
         */
        this.mArticleTab.classList.remove('active');
        this.mEmulatorTab.classList.add('active');
        this.mRecipeTab.classList.remove('active');
        this.mProductTab.classList.remove('active');
        this.mAdminTab.classList.remove('active');
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

    connectedCallback()
    {
        console.log("UploaderView - connected");
        this.listen( 'logout-signal', e => this.logout() );
    }

    disconnectedCallback()
    {
        console.log( `UploaderView - disconnected` );
    }
    
}

window.customElements.define('uploader-view', UploaderView);

export { UploaderView };