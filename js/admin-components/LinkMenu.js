import { WCBase } from '../WCBase.js';
import { LinkEntry } from './LinkEntry.js';

/**
 * LinkMenu is a GUI Component that houses
 * items with links to other components.
 * The items has icon and text.
 * When clicked/touched, the
 * linked view will me opened in
 * a view, that is assinged for it.
 * 
 * Layout:
 * 
 * the layout can be either vertical (default),
 * or horizontal.
 * The vertical layout may be reduced in width to
 * only display icons.
 * 
 * icon| header text  |
 * 
 * --------------------
 * | * |  editor      |
 * --------------------
 * | & |  settings    |
 * --------------------
 * ...
 * --------------------
 * | # |  posts       |
 * --------------------
 *  
 */
class LinkMenu extends WCBase
{
    constructor()
    {
        super();
        
        this.mEntries = [];

        if ( this.dataset.entries )
        {
            const entries  = this.dataset.entries;
            const parsed   = entries ? JSON.parse( entries ) : undefined;

            if ( Array.isArray( parsed ) )
            {
                this.mEntries = parsed;
            }
        }

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
         <ul class='menu'>
         </ul>`);    
        
        this.setupStyle
        (`.menu { 
            margin: 0 auto; 
            display: flex; 
            flex-direction: column;
            max-width: 200px;
            height: -webkit-fill-available;
            overlow-y: scroll;
            background-color: rgba(255, 240, 240, 0.75);
        }
        .menu__entry {
            position: relative;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            bodrer-bottom: 1px dashed rgba(0, 0, 68, 0.25);
        }
        .menu__icon {
            width: 48px;
            height: 48px;
        }
        .menu__header {
            padding: 8px;
            text-align: left;
        }`);

        
        this.mStore = this.shadowRoot.querySelector( '.menu' );
    }  

    addLink( icon, header, link, params = [] )
    {
        const linkEntry = new LinkEntry( icon, header, link, params );
        if ( linkEntry instanceof LinkEntry ) this.mStore.appendChild( linkEntry );
    }

    connectedCallback()
    {
        for ( const entry of this.mEntries )
        {
            const { icon, header, link } = entry;
            const params = entry.params ? entry.params : null;

            if 
            ( 
                typeof icon   === 'string' && 
                typeof header === 'string' && 
                typeof link   === 'string'
            )
            {
                this.addLink( icon, header, link, params );
            }
        }
    }
}

window.customElements.define( 'link-menu', LinkMenu );

export { LinkMenu };