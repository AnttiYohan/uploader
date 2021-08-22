import { WCBase, MEDIA_URL } from '../WCBase.js';
import { FileCache } from '../util/FileCache.js';
import { deleteChildren, newTagAttrsHTML } from '../util/elemfactory.js';
import { ImageManagerEntry } from './ImageManagerEntry.js';

/**
 * Entity storage component for certain image category.
 * Used in ImageManager
 */
class ImageManagerStore extends WCBase
{
    constructor()
    {
        super();

    
        this.mPageNumber = 0;
        this.mPageSize   = 10;
        this.mPageCount  = 1;

        this.mCategory = this.dataset.category;

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<div class='store'>
            <div class='store__header'>
               <p class='store__title'><slot></p>
               <button class='store__button'>load images</button>
            </div>
            <ul class='store__container'>
            </ul>
            <nav class='store__pagination'>
              <div class='pagination__prev disabled'>prev</div>
              <ul  class='pagination__page-list'>
              </ul>
              <div class='pagination__next disabled'>next</div>
            </nav>
          </div>`);

        this.setupStyle
        (`
        .store {
            width: -weblit-fill-available;
        }
        .store__header {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(200, 67, 67, .5);
            height: 48px;
        }
        .store__title {
            color: #fff;
            width: 153px;
            overflow-x: hidden;
            font-size: 20px;
            text-transform: uppercase;
            transition:
            width 330ms ease-in;
        }
        .store__container {
            margin: 0;
            padding: 0;
        }
        .store__pagination {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(200, 67, 67, .5);
        }
        .pagination__prev,
        .pagination__next {
            cursor: pointer;
            width: 64px;
            text-align: center;
            color: #fff;
            line-height: 48px;
        }
        .pagination__page-list {
            margin: 0;
            padding: 0;
            min-width: 64px;
            width: fit-content;
            max-width: 300px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style-type: none;   
        }
        .pagination__page {
            cursor: pointer;
            color: #fff;
            width: fit-content;
            margin: 0;
            padding-left: 4px;
            padding-right: 4px;
            line-height: 36px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            transition:
            border-bottom-color 400ms;
        }
        .pagination__prev.disabled,
        .pagination__next.disabled {
            cursor: default;
            opacity: .5;
        }
        .pagination__page.current {
            cursor: default;
            border-bottom-color: #fff;
        }
        .store__button { 
            cursor: pointer;
            display: inline-block; 
            margin-left: 16px; 
            height: 32px;
            min-width: 128px;
            border-radius: 16px;
            color: #fff;
            text-align: center;
            background-color: #400a28;
            padding-top: 1px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            box-shadow:
            0 0 12px 0 rgba(85, 0, 0, .25),
            inset 0 8px 9px -3.5px rgba(255, 240, 250, .4); 
            border: none;
            outline: 2px dashed transparent;
            transition:
            outline-color 400ms;

        }
        .store__button.focus {
            outline-color: rgba(80, 40, 40, .35);
        }
        @media screen and (max-width: 550px) {
            .store__title {
                width: 0px;
            }
        }`);

        this.mFrame         = this.shadowRoot.querySelector( '.store' );
        this.mStore         = this.shadowRoot.querySelector( '.store__container' );

        this.mPrev      = this.shadowRoot.querySelector( '.pagination__prev' );
        this.mNext      = this.shadowRoot.querySelector( '.pagination__next' );
        this.mPageList  = this.shadowRoot.querySelector( '.pagination__page-list' );

        this.mPrev.addEventListener( 'click', e => this.navigatePrev( e ) );
        this.mNext.addEventListener( 'click', e => this.navigateNext( e ) );
        const loadButton    = this.shadowRoot.querySelector( '.store__button' );
        loadButton.addEventListener( 'click', e => this.loadMedia() );
    }

    navigatePrev( e )
    {
        if ( e.target.classList.contains( 'disabled' ) ) return;

        const page = e.target.dataset.page;
        if ( ! isNaN( page ) )
        {
            this.loadMedia( page );
        }
    }

    navigateNext( e )
    {
        if ( e.target.classList.contains( 'disabled' ) ) return;

        const page = e.target.dataset.page;
        if ( ! isNaN( page ) )
        {
            this.loadMedia( page );
        }
    }

    navigatePage( e )
    {
        if ( e.target.classList.contains( 'current' ) ) return;
        const page = e.target.dataset.page;
        if ( ! isNaN( page ) )
        {
            this.loadMedia( page );
        }
    }

    async loadMedia( page = 0 )
    {
        if ( typeof this.mCategory !== 'string' )
        {
            console.warn( 'Category not set in ImageMangerStore. Cannot load images!' );
            return;
        }


        const route = 
        MEDIA_URL + `/${this.mCategory.toLowerCase()}?page=${page}&size=${this.mPageSize}`;
        
        //const className = 
        //this.mCategory[0].toUpperCase +
        //this.mCategory.substring(1).toLowerCase() +

        const { ok, status, text } = await FileCache.getRequest( route, true, false );
        
        let entries;

        if ( ok )
        {
            this.parseResponse( text, status );
        }
        else
        {
            console.log( `ImageManagerStore::loadImages ${route} status: ${status}` );
        }
    }
    
    async parseResponse( text, status )
    {
        let body;

        try
        {
            body = JSON.parse( text );
        }
        catch ( error )
        {
            console.warn( `ImageMangerStore parseRequest error: ${error}` );
            return;
        }

        this.mPageNumber = body.page;
        this.mPageCount  = body.total;
        
        this.renredEntries( body.content );
        this.createPagination
        ( 
            body.first, 
            body.prev, 
            body.next,
            {
                page:  body.page,
                total: body.total
            } 
        );
        console.log( body );
    }

    renredEntries( entries )
    {
        if ( ! entries || ! Array.isArray( entries ) )
        {
            console.log( 'malformed media response' );
            return;
        }

        deleteChildren( this.mStore );

        if ( entries.length === 0 )
        {
            console.log( `No media at the page` );
            return;
        }

        for ( const media of entries )
        {
            const entry = new ImageManagerEntry( media.image, media.thumbnail );
            this.addEntry( entry );
        }
    }

    createPagination( first, prev, next, current )
    {
        const { page, total } = current;

        console.log( `Prev:  ${prev}`);
        console.log( `Next:  ${next}`);
        console.log( `Page:  ${page},  type: ${typeof page}`);
        console.log( `Total: ${total}, type: ${typeof total}`);
        /**
         * Create pagination
         */
        if ( total )
        {
            /**
             * Clear the page-list
             */
            deleteChildren( this.mPageList );

            let i = 0;

            for ( i = 0; i < total; i++ )
            {
                const link = newTagAttrsHTML
                (
                    'p',
                    {
                        'class': `pagination__page${i === page ? ' current' : ''}`,
                        'data-page': i
                    },
                    `${i + 1}`
                );

                if ( i !== page ) link.addEventListener( 'click', e => this.navigatePage( e ) );
                this.mPageList.appendChild( link );
            }

            /**
             * Create prev link
             */
            if ( prev.pageNumber < page )
            {
                this.mPrev.dataset.page = prev.pageNumber;
                this.mPrev.classList.remove( 'disabled' );
            }
            else this.mPrev.classList.add( 'disabled' );

                         /**
             * Create next link
             */
            if ( next.pageNumber > page && next.pageNumber < total )
            {
                this.mNext.dataset.page = next.pageNumber;
                this.mNext.classList.remove( 'disabled' );
            }
            else this.mNext.classList.add( 'disabled' );

        }
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

window.customElements.define( 'image-manager-store', ImageManagerStore );

export { ImageManagerStore };