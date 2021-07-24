import { WCBase, API_URL } from '../WCBase.js';
import { FileCache } from '../util/FileCache.js';
import { deleteChildren, newTagClassChildren, newTagClassHTML } from '../util/elemfactory.js';

/**
 * StatSet is a list/set of statistical items
 * articles/product/recipe/files/thumbnails/users
 */
class StatSet extends WCBase
{
    constructor()
    {
        super();
        

        this.mRoute = this.dataset.route;

        this.mPluralKey = this.dataset.entities;
        this.mEntityKey = this.dataset.entity;
        this.mRelated   = this.dataset.related;
        this.mReader    = this.dataset.reader;
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate
        (
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='component'>
            <div class='component__row'>
                <h4 class='component__header'><slot></h4>
            </div>
            <button class='button--refresh'>Reload</button>
            <ul class='stat'>
            </ul>
            <p class='message'></p>
         </div>`
        );    
        
        this.setupStyle
        (`.stat { margin: 8px auto; padding: 8px; display: flex; flex-direction: column; width: 100%; box-shadow -2px 2px 13px -3px rgba(0,0,0,.25); background-color: #f0f2ff; border-radius: 6px; border: 1px solid rgba(0,0,20,.25); }
          .stat__entry { display: flex; border-bottom: 1px solid rgba(0,0,0,.12); justify-content: space-between; }
          .stat__header { flex-basis: 50%; display: flex; flex-direction: row; }
          .stat__entity { flex-basis: 50%; display: flex; flex-direction: column; }
          .stat__key { height: 48px; padding: 8px; border-bottom: 1px solid rgba(0,0,0,.25); font-size: 14px; text-transform: uppercase; }
          .stat__value { margin-top: .7em; height: 48px; font-size: 12px; }
          .message { margin-top: 32px; margin-bottom: 32px; border: 1px solid rgba(0,0,0,.25); padding: 8px; width: min(350px, 80vw); height: 350px; overflow-y: scroll; }
        `);
        // ---------------------------
        // - Save element references
        // ---------------------------

        const refreshButton = this.shadowRoot.querySelector('.button--refresh');

        this.mStat = this.shadowRoot.querySelector( '.stat' );
        this.mMessage = this.shadowRoot.querySelector( '.message' );

        if ( this.mRoute )
        {
            refreshButton.addEventListener('click', e => 
            { 
                this.execQuery();
            });
        }
     
        
    }

    async execQuery()
    {
        const { status, ok, text } = await FileCache.getRequest( `${API_URL}/${this.mRoute}`, true, false );

        if ( ok )
        {
            let set = undefined;

            try
            {
                set = JSON.parse( text );
            }
            catch ( error ) 
            {
                console.log( `SetSet::execQuery response parse error: ${error}` );
                return;
            }

            if ( Array.isArray( set ) )
            {
                this.pushDataSet( set );
            }
            else
            {
                if ( 'message' in set ) this.displayMessage( set.message );
                if ( this.mPluralKey in set )
                {
                    this.pushDataSet( set[ this.mPluralKey ] );
                }
            }
        }
    }

    displayMessage( message )
    {
        this.mMessage.textContent = message;
    }

    async pushDataSet( set )
    {
        if ( ! set || ! Array.isArray( set ) ) return;

        deleteChildren( this.mStat );

        const readerClass = await import( `./${this.mReader}.js` );
        const reader = new readerClass.default();

        /**
         * Iterate through the set
         */
        for ( const entry of set )
        {
            //const { product, claims } = reader.generateRow( entry );

            this.mStat.appendChild( reader.fetchHTML( entry ) );
            //console.table( product );
            //console.table( claims );
        }
        /*
        console.log( `Relation: ${this.mRelated}` );
        for ( const entry of set )
        {
            const entity = entry[ this.mEntityKey ];
            let entityTitle = 'Unknown';

            if ( 'title' in entity ) entityTitle = entity.title;
            if ( 'name'  in entity ) entityTitle = entity.name;

            let relatedString = '';

            if ( this.mRelated in entity )
            {
                const related = entity[ this.mRelated ];
                if ( Array.isArray( related ) )
                {
                    console.table( related );

                    for ( const item of related )
                    {
                        if ( typeof item === 'string' )
                        {
                            relatedString += `${item} `;
                        }
                        else
                        {
                            if ( 'title' in item )
                            {
                                relatedString += `${item.title} `
                            }
                        }
                    }
                }
                else 
                {
                    if ( 'title' in related )
                    {
                        relatedString += `${related.title}`
                    }
                }
            }

            const children = 
            [
                newTagClassHTML( 'h4', 'stat__key',   this.mEntityKey ),
                newTagClassHTML( 'p',  'stat__value', entityTitle )
            ];

            if ( relatedString.length )
            {
                children.push( newTagClassHTML( 'p',  'stat__related', relatedTitle ) );
            }
            
            const elem = newTagClassChildren
            (
                'li',
                'stat__entry',
                children
            );

            this.mStat.appendChild( elem );
        }*/
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()    
    {
        console.log( `StatSet connected, route: ${API_URL}/${this.mRoute}` );
    }

    disconnectedCallback()
    {
    }  
}

window.customElements.define( 'stat-set', StatSet );

export { StatSet };