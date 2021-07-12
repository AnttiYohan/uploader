import { deleteChildren, newTagClass, newTagClassChildren, newTagClassHTML } from "../util/elemfactory";
import { WCBase, RECIPE_STEP_MEDIA_URL } from "../WCBase";
import { FileCache } from '../util/FileCache.js';

/**
 * An Editor that helps to choose the right media and layout
 * For Recipe Steps.
 * Image management tool 
 */
class StepLayoutEditor extends WCBase
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
               <h2 class='component__header'>Step Media:</h2>
             </div>
             <div class='component__row selector'>
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
        this.mSelector = this.shadowRoot.querySelector('.selector');
        this.mLayout   = this.shadowRoot.querySelector('.component__layout');
    }

    createSelector( steps )
    {
        return 'sss';
    }

    createLayout( steps )
    {
        deleteChildren( this.mLayout );

    
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
     * Step Media request
     * ------
     * @param   {integer} id 
     * @return 
     */
    async getMedia( id )
    {
        const response = await FileCache.getRequest
        (
            `${RECIPE_STEP_MEDIA_URL}/${id}`
        );
        
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

            this.createLayout( mainImage, thumbnails );
        }
    }

    
    // ----------------------------------------------------------------
    // - Lifecycle callbacks and child component event callbackcs
    // ----------------------------------------------------------------

    connectedCallback()
    {
        // this.imageSetLayout();

        if ( this.mRecipeId ) this.getMedia( this.mRecipeId );
        /**
         * The Editor is now connected,
         * Fill the components with original values.
         * Let's use the Input Operator to deal with this, too,
         * So we have everything Centralized
         */
        this.emit( 'step-layout-editor-connected' );
    }

    disconnectedCallback()
    {
    }  

}

window.customElements.define('step-layout-editor', StepLayoutEditor);

export { StepLayoutEditor };