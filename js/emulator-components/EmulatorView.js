import { WCBase, props, RECIPE_URL } from '../WCBase.js';
import { newTagClass, newTagClassChildren, newTagClassHTML, deleteChildren, selectValue, setImageFileInputThumbnail } from '../util/elemfactory.js';
import { FileCache } from '../util/FileCache.js';
import { TextInputRow } from '../TextInputRow.js';
import { ResponseNotifier } from '../ResponseNotifier.js';
import { RecipeSearchScreen } from './RecipeSearchScreen.js';
import { RecipeBrowseScreen } from './RecipeBrowseScreen.js';
import { RecipeDetailScreen } from './RecipeDetailScreen.js';
import { EmulatorLayoutControls } from './EmulatorLayoutControls.js';


/**
 * Mobile App Emulator View
 */
class EmulatorView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------
        this.mProductObjects = [];

        console.log(`ProductView::constructor called`);

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='uploader'>
            <div class='uploader__frame' data-input-frame>
                <emulator-layout-controls></emulator-layout-controls>
                <div class='component__frame'>
                  <recipe-search-screen></recipe-search-screen>
                  <recipe-browse-screen></recipe-browse-screen>
                  <recipe-detail-screen></recipe-detail-screen>
                </div>
            </div>
        </div>`);

        this.setupStyle
        (`.uploader__frame {
           max-width: 1200px;
           width: 100%;
        }
        .component__frame { margin-top: 16px; flex-wrap: wrap; justify-content: center; }
        `);
        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.uploader');
        
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        this.emit( 'emulator-view-connected' );
        //this.loadRecipes();
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'emulator-view', EmulatorView );

export { EmulatorView };