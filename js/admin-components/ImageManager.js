import { MEDIA_WS, WCBase } from '../WCBase.js';
import { deleteChildren } from '../util/elemfactory.js';
import { ImageManagerStore } from './ImageManagerStore.js';

/**
 * ImageManager is a place where 
 * all the BabyFoodWorld application images and thumbnails
 * can be listed and edited.
 * There are four main image categories:
 * - article images
 * - product images
 * - recipe images
 * - user profile images
 * 
 * Read Actions:
 * - get image details:
 * -- associated thumbnail + details (size, dimensions, name, original name, id..)
 * -- details: size, dimensions, name, id.
 * 
 * Individual Write actions:
 * - add new image (and thumbnail)
 * - generate new thumbnail
 * - assing external thumbnail
 * - crop image
 * - resize image
 * 
 * Group actions:
 * - generate new thumbnails
 * - resize images
 * - crop images
 * 
 * Product images are an exception, since they are SVGs.
 * They do now have a thumbnail,
 * Product image actions:
 * - readjust viewport
 * - add new image
 */
class ImageManager extends WCBase
{
    constructor()
    {
        super();

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------


        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<div class='image-manager'>
            <div class='image-manager__header'>
               <h1 class='image-manager__title'>Image Manager</h1>
            </div>
            <nav class='image-manager__category-nav'>
              <div class='image-manager__category-tab category--article'>Article</div>
              <div class='image-manager__category-tab category--product'>Product</div>
              <div class='image-manager__category-tab category--recipe'>Recipe</div>
              <div class='image-manager__category-tab category--user'>User</div>
            </nav>
            <div class='image-manager__stores'>
              <image-manager-store data-category='recipe'>Recipe Media</image-manager-store>
            </div>
          </div>`);

        this.setupStyle
        (`
        .image-manager { 
            backdrop-filter: invert(0.25) blur(3px);
            border-radius: 4px; 
            box-shadow: 0 8px 12px -2px rgba(20,0,0,.25);
            width: -webkit-fill-available; 
        }
        .image-manager__header {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(200, 67, 67, .5);
            height: 64px;
        }
        .image-manager__title {
            color: #fff;
            font-size: 20px;
            text-transform: uppercase;
        }
        .image-manager__category-nav {
            display: flex;
            justify-content: center;
            align-items: baseline;
            height: 64px;
            background-color: rgba(200, 67, 67, .5);
        }
        .image-manager__category-title {
            flex-basis: 128px;
            color: #fff;
            text-align: center;
        }
        .image-manager__category-tab {
            cursor: pointer;
            color: #fff;
            text-align: center;
            font-size: 14px;
            text-transform: uppercase;
            width: min(100px, 25vw);
            padding-left: 8px;
            padding-right: 8px;
            line-height: 58px;
            border-bottom-width: 6px;
            border-bottom-style: solid;
            border-bottom-color: transparent;
            transition:
            border-bottom-color 400ms;
        }
        .image-manager__category-tab.active {
            border-bottom-color: #fff;
        }
        .image-manager__button { 
            display: block; 
            margin: auto; 
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
        }
        .image-manager__stores {
            height: -webkit-fill-available; 
        }
        `);

        this.mRootElement = this.shadowRoot.querySelector( '.image-manager' );
        this.mCategoryNav = this.shadowRoot.querySelector( '.image-manager__category-nav' );
        this.mStore       = this.shadowRoot.querySelector( '.image-manager__store' );

        /**
         * Add event listeners into the category tabs
         */

        const tabs = Array.from( this.mCategoryNav.querySelectorAll( '.image-manager__category-tab' ) );
        
        for ( const tab of tabs )
        {
            tab.addEventListener( 'click', e => {
                console.log( `Tab clicked: ${e.target.textContent}` );

                for ( const t of tabs )
                {
                    ! t.isEqualNode( e.target )
                    ? t.classList.remove('active')
                    : t.classList.add('active');
                }
            });
        }

        /**
         * Create WebSocket conection
         */
        const ws = new WebSocket( MEDIA_WS );
        ws.addEventListener( 'message', e => this.displayWebSocketMessage( e.data ) );
    }
    
    displayWebSocketMessage( data )
    {
        console.log( `Raw message: ${data}` );

        let message;

        try 
        {
            message = JSON.parse( data );
        }
        catch ( error )
        {
            console.log( `Error: ${error}` );
            return;
        }

        console.log( `Parsed message: ${message}` );
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

    /**
     * Return the stored entry count
     * 
     * @return {number}
     */
    get count()
    {
        return this.mStore.children.length;
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

window.customElements.define( 'image-manager', ImageManager );

export { ImageManager };