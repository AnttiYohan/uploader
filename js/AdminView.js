import { WCBase } from './WCBase.js';
import { LinkMenu } from './admin-components/LinkMenu.js';
import { deleteChildren } from './util/elemfactory.js';

/**
 * AdminView is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Displays various meaningful BFW server stats
 * Manages crucial features
 */
class AdminView extends WCBase
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
         <div class='admin'>
            <link-menu data-entries='[
                {
                    "icon": "assets/icon_edit.svg",
                    "header": "product claims",
                    "link": "StatSet",
                    "params" : [ 
                        "product/claims", 
                        "products", 
                        "ProductClaimsReader" 
                    ]
                },
                {
                    "icon": "assets/icon_placeholder.svg",
                    "header": "media",
                    "link": "ImageManager"
                }
            ]'></link-menu>
            <div class='admin__detail'>
            </div>`);    
        
        const offsetTop = this.offsetTop;
        
        this.setupStyle
        (`.admin { 
            margin: 0 auto; 
            display: flex; 
            flex-direction: row;  
            max-width: 1200px;
            height: calc(100vh - 57px);
        }
        .admin__detail {
            overflow-y: scroll;
        }`);

        this.mRootElement = this.shadowRoot.querySelector( '.admin' );
        this.mDetailView  = this.shadowRoot.querySelector( '.admin__detail' );
    }  

    /**
     * Opens a linked view into the DetailView
     * 
     * @param {string} link 
     */
    async openDetail( initiator )
    {
        if ( typeof initiator.link !== 'string' || initiator.link.length < 4 ) return;

        const link      = initiator.link;
        const params    = Array.isArray( initiator.params )
                        ? initiator.params
                        : [];

        const path      = './admin-components/';
        const linkClass = ( await import( `${path}${link}.js` ) )[ link ];
        const element   = new linkClass( ...params );

        if ( element instanceof HTMLElement )
        {
            deleteChildren( this.mDetailView );
            this.mDetailView.appendChild( element );
        }   
    }

    connectedCallback()
    {
        const offsetTop = this.offsetTop;
        if ( offsetTop )
        {
            this.mRootElement.style.height = `calc(100vh - ${offsetTop}px)`;
        }
        this.listen( 'link-open', e => this.openDetail( e.detail ) );
    }
}

window.customElements.define( 'admin-view', AdminView );

export { AdminView };