import { deleteChildren, newTagClass, newTagClassChildren, newTagClassHTML } from "../util/elemfactory";
import { WCBase, RECIPE_MEDIA_URL } from "../WCBase";
import { FileCache } from '../util/FileCache.js';

/**
 * Media Editor View, image management tool 
 */
class MediaEditor extends WCBase
{
    /**
     * Recipe Editor Constructor function 
     */
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mRecipeId = this.dataset.id;
        
        this.mScaling = 
        [
            {
                width: 48
            },
            {
                width: 96
            },
            {
                width: 144
            },
            {
                width: 192
            },
            {
                width: 288
            }
        ];

        this.mImageElements = [];
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupTemplate(
        `<link rel='stylesheet' href='assets/css/components.css'>
         <div class='editor'>
           <div class='component__column'>
             <div class='component__row header'>
               <h2 class='component__header'>Media Manager: <slot></h2>
             </div>
             <div class='component__row tab'>
               <div class='component__tab'>Scaling</div>
               <div class='component__tab'>Image Set</div>
             </div>
             <div class='component__layout'>
             </div>
           </div>
         </div>`);

        this.setupStyle
        (`
        .editor { max-width: 1200px; margin: 0 auto; }
        .two_column .button { margin: auto; }
        .two_column .column__item { margin-bottom: 16px; }
        `);
    
        this.mLayout = this.shadowRoot.querySelector('.component__layout');
    }

    imageSetLayout( mainImage, thumbnails )
    {
        deleteChildren( this.mLayout );

        /**
         * Define thumbnail frame
         */
        const windows = [];
        this.mImageElements = [];

        for (const thumbnail of thumbnails)
        {
            const width = `${thumbnail.width}px`;
            const height = `${thumbnail.height}px`;
            const img = newTagClass( 'img', 'image' );
            this.mImageElements.push( img );
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            img.src = `data:${thumbnail.type};base64,${thumbnail.data}`;

            const window__image = newTagClassChildren
            (
                'div',
                'window__image',
                [
                    img,
                    newTagClassHTML('p', 'label--width', width)
                ]
            );
            const window__controls = newTagClassChildren
            (
                'div',
                'window__controls',
                [
                    newTagClassChildren(
                        'div',
                        'component__row',
                        [
                            newTagClassHTML(
                                'p',
                                'component__label',
                                'control-a'
                            ),
                            newTagClassHTML(
                                'p',
                                'component__label',
                                'control-b'
                            )
                        ]
                    ),
                    newTagClassChildren(
                        'div',
                        'component__row',
                        [
                            newTagClassHTML(
                                'p',
                                'component__label',
                                'control-1'
                            ),
                            newTagClassHTML(
                                'p',
                                'component__label',
                                'control-2'
                            )
                        ]
                    )
                ]
            );
            const window = newTagClassChildren
            (
                'div',
                'component__window',
                [
                    window__image,
                    window__controls
                ]
            );
            windows.push(window);
        }

        /**
         * Define main image element
         */
         const mainImageElement = newTagClass( 'img', 'image--main' );
         mainImageElement.src = `data:${mainImage.fileType};base64,${mainImage.data}`;

         
        const data = [
            newTagClassHTML( 'p', 'component__label', 'Width: '),
            newTagClassHTML( 'p', 'component__label', 'Height: ')
        ];
        const controls = [
            newTagClassHTML( 'p', 'component__label', 'Add image' ),
            newTagClassHTML( 'p', 'component__label', 'Create Set' )
        ];

        
        const mainImageData = newTagClassChildren(
            'div',
            'component__column',
            data
        );
        const mainImageControls = newTagClassChildren( 
            'div',
            'component__column',
            controls
        );
        const mainImageNav = newTagClassChildren( 
            'div',
            'component__frame',
            [
                mainImageData,
                mainImageControls
            ]
        );
        const mainImageLayout = newTagClassChildren(
            'div',
            'component__column',
            [
                mainImageElement,
                mainImageNav
            ]
        );
        const layout = newTagClassChildren
        (
            'div',
            'component__column',
            [
                mainImageLayout,
                newTagClassChildren(
                    'div',
                    'component__fluid--600',
                    windows
                )
            ]
        );

        this.mLayout.appendChild( layout );
    }

    scalingLayout()
    {
        deleteChildren( this.layout );

        const scales = [];
        for (const item of this.mScaling)
        {
            const scale = newTagClassChildren(
                'div',
                'component__column',
                [
                    newTagClassHTML('h2','component__header', `${item.width}px`),
                    newTagClass('div', 'component__line')
                ]
            );
            scales.push(scale);
        }

        const layout = newTagClassChildren
        (
            'div',
            'component__column',
            [
                newTagClassChildren(
                    'div',
                    'component__row',
                    [
                        scales
                    ]
                ),
                newTagClassChildren(
                    'div',
                    'component__frame',
                    [
                        newTagClassHTML(
                            'div',
                            'component__label',
                            'control-1'
                        ),
                        newTagClassHTML(
                            'div',
                            'component__label',
                            'control-2'
                        )
                    ]
                )
            ]
        );

        this.mLayout.appendChild( layout );
    }

    /**
     * Updae methods for recipe 1:1 fields
     * @param   {object} dto 
     * @return 
     */
    async getRecipeMedia( id )
    {
        const response = await FileCache.getRequest
        (
            `${RECIPE_MEDIA_URL}/${id}`,
            true,
            true
        );
        
        if ( response.status > 200 )
        {
            console.log( `get recipe media: Status ${response.status}` );
        }

        if ( typeof response === 'string' )
        {
            const media = JSON.parse( response );
            const mainImage  = media.image;
            const thumbnails = media.thumbnails;

            this.mImageStore = [];

            for (const thumbnail of thumbnails)
            {
                this.mImageStore.push(thumbnail);
            }

            this.imageSetLayout( mainImage, thumbnails );

            //this.displayImages();
        }
        else
        if ( response.status === 200 )
        {
            const media = JSON.parse( response.text );
            const mainImage  = media.image;
            const thumbnails = media.thumbnails;

            this.mImageStore = [];

            for (const thumbnail of thumbnails)
            {
                this.mImageStore.push(thumbnail);
            }

            this.imageSetLayout( mainImage, thumbnails );
        }
    }


    initEditor()
    {
 
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        // this.imageSetLayout();

        if ( this.mRecipeId ) this.getRecipeMedia( this.mRecipeId );
        /**
         * The Editor is now connected,
         * Fill the components with original values.
         * Let's use the Input Operator to deal with this, too,
         * So we have everything Centralized
         */
        this.emit( 'media-editor-connected' );
    }

    disconnectedCallback()
    {
    }  

}

window.customElements.define('media-editor', MediaEditor);

export { MediaEditor };