import { WCBase } from '../WCBase.js';

/**
 * LinkEntry is a GUI component,
 * intended to be used in the LinkMenu.
 * 
 * It acts a a basic link element,
 * containing:
 * - icon
 * - header
 * - link
 *  
 */
class LinkEntry extends WCBase
{
    constructor( icon, header, link, params )
    {
        super();
        
        /**
         * Grab the params
         */
        this.mIcon   = icon;
        this.mHeader = header;
        this.mLink   = link;

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<li class='link'>
            <div class='link__icon'></div>
            <h3  class='link__header'>${header}</h3>
         </li>`);    
        
        this.setupStyle
        (`.link {
            cursor: pointer;
            position: relative;
            width: 200px;
            height: 48px;
            overflow-x: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            bodrer-bottom: 1px dashed rgba(0, 0, 68, 0.25);
            /*transition:
            width: 360ms ease-in;*/
        }
        .link__icon {
            min-width: 48px;
            height: 48px;
            background-repeat: no-repeat;
            background-size: cover;
            background-image: url('${icon}');
        }
        .link__header {
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px;
            text-align: left;
            transform: scale3d(1, 1, 1);
            transform-origin: left;
            transition:
            transform 330ms ease-in;
        }
        @media screen and (max-width: 850px) {

            .link { width: 48px; }
            .link__header { 
                transform: scale3d(0, 1, 1); 
            }

        }`);

        
        this.mIconElement   = this.shadowRoot.querySelector( '.link__icon' );
        this.mHeaderElement = this.shadowRoot.querySelector( '.link__header' );

        const rootElement = this.shadowRoot.querySelector( '.link' );
        rootElement.addEventListener( 'click', 
            e => this.emit( 'link-open', { link, params } ) 
        );
    }

    get link()
    {
        return this.mLink;
    }
}

window.customElements.define( 'link-entry', LinkEntry );

export { LinkEntry };