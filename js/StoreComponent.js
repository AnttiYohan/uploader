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

        this.mRequired = this.hasOwnProperty('required') ? true : false;
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------


        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component component--root'>
            <div class='component__row'>
               <p class='component__label${this.mRequired ? ' required' : ''}'><slot></p>
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

        this.mFrame         = this.shadowRoot.querySelector( '.component--root' );
        this.mAsteriskLabel = this.shadowRoot.querySelector( '.component__label.required' );
        this.mStore         = this.shadowRoot.querySelector( '.store' );

    }
    
    get count()
    {
        return this.mStore.children.length;
    }

    /**
     * Return the store entry objects in an array
     * 
     * @return {array}
     */
    get children()
    {
        return Array.from( this.mStore.children );
    }

    /**
     * Return the store entry values in an array
     * 
     * @return {array}
     */
    
    get entries()
    {
        const result = [];
    
        for ( const entry of this.mStore.children )
        {
            result.push( entry.value );
        }

        return result;
    }  
  
    /**
     * Returns the entries' values or if no entries, undefined
     * 
     * @return {array|undefined}
     */
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
        return this.mRequired;
    }

    reset()
    {
        deleteChildren( this.mStore );
        this.checkAsterisk();
    }

    swap( indexA, indexB )
    {
        /**
         * Ensure that the indices are numbers, and there are entries like these
         */
        if ( typeof indexA !== 'number' || typeof indexB !== 'number' ) return;

        /**
         * Ensure that the indices are not the same
         */
        if ( indexA === indexB ) return;

        /**
         * Ensure the range, less that one is not allowed
         */
        if ( indexA < 1 || indexB < 1 ) return;

        const count = this.count;

        /**
         * Ensure that the indices are not larges than the entry count
         */
        if ( indexA > count || indexB > count ) return;

        /**
         * Create clones
         */
        const entryA = this.mStore.children[indexA - 1];
        const entryB = this.mStore.children[indexB - 1];

        /**
         * Disconnet everything
         */
        const nodes = this.children;
        
        deleteChildren(this.mStore);

        /**
         * Repositon
         */
        nodes[indexA - 1] = entryB;
        nodes[indexB - 1] = entryA;

        //this.mStore.append( nodes );
        for ( const node of nodes )
        {
            this.mStore.appendChild( node );
        }
    }
    /**
     * Ensures that the asterisk of requirement
     * is properly set
     */
    checkAsterisk()
    {
        if ( ! this.mAsteriskLabel ) return;
        const clist = this.mAsteriskLabel.classList;
        this.count ? clist.add( 'off' ) : clist.remove( 'off' );
    }

    /**
     * Return the stored entry count
     * 
     * @return {number}
     */
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