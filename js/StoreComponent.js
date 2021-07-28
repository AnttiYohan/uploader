import { deleteChildren } from './util/elemfactory.js';
import { WCBase } from './WCBase.js';

/**
 * This is a base class for a component with a List / Store
 * of child items, that are managed withing
 */
class StoreComponent extends WCBase
{
    constructor( options = {} )
    {
        super();

        /** Unique string as key for HTTP Request */
        this.mKey   = this.dataset.input ? this.dataset.input : '';

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
               <p class='component__label'><slot></p>
            </div>
            ${'template' in options ? options.template : ''}
            <div class='store'>
            </div>
          </div>`);

        this.setupStyle
        (`
        .component { background-color: #fff; border-radius: 4px; box-shadow: 0 8px 12px -2px rgba(20,0,0,.25); }
        ${'style' in options ? options.style : ''}
        .button { display: block; margin: auto; }
        .store { display: flex; flex-direction: column; }
        `);

        this.mStore = this.shadowRoot.querySelector( '.store' );

    }
    
    get entries()
    {
        const result = [];
    
        for ( const entry of this.mStore.children )
        {
            result.push( entry.value );
        }

        return result;
    }  
  
    get value()
    {
        const  entries = this.entries;
        return entries.length ? entries : undefined;
    }

    object()
    {
        const  result = this.value;
        return result ? {[this.mKey]: result} : result;
    }
  
    /**
     * Return required status
     * ---------------
     * @return {boolean}
     */
    get required()
    {
        return false;
    }

    reset()
    {
        deleteChildren( this.mStore );
    }

    get count()
    {
        return this.mStore.children.length;
    }

    /**
     * method stub
     */
    notifyRequired( ensure = true ) 
    {
        return '';
    }  

    addEntry( entry )
    {
        this.mStore.appendChild( entry );
    }

    pushDataSet( set )
    {
        deleteChildren( this.mStore );

        for ( const entry of set )
        {
            this.addEntry( entry );
        }
    }
}

export { StoreComponent };