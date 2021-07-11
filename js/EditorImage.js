import { EditorComponent } from './EditorComponent.js';
import { props } from './WCBase.js';

/**
 * Displays, in editor, a saved image element
 * ==========================================
 */
 class EditorImage extends EditorComponent
 {
    constructor()
    {
        super();

         // -----------------------------------------------
         // - Setup ShadowDOM and possible local styles
         // -----------------------------------------------
 
        this.mImage = undefined;

        this.attachShadow({mode : "open"});
   
        this.setupTemplate
         (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
                <div class='component__row'>
                    <p class='component__label'><slot></p>
                </div>
                <img class='image__area' />
            </div>`);

         this.setupStyle
          (`.image__area {
            position: relative;
            border: 1px solid ${props.color.grey};
            border-radius: 2px;
            width: ${props.input_width};
            height: 96px;
        }`);

        this.initValueElement( this.shadowRoot.querySelector('.image__area') ); 
 
     }

     // ----------------------------------------------
     // - Methods
     // ----------------------------------------------

    reset()
    {

    }
    
    addContent( mediaDto )
    {

        if ( mediaDto.image )
        {
            this.mImage = mediaDto.image;
        }
        else if ( mediaDto.thumbnail )
        {
            this.mImage = mediaDto.thumbnail;
        }
        
        this.mValueElement.src = `data:${this.mImage.fileType};base64,${this.mImage.data}`;
     
        /*const reader = new FileReader();
        reader.onloadend = (e) =>
        {
            this.mValueElement.style.backgroundImage = `url('${reader.result}')`;
            this.mValueElement.style.backgroundSize = `100%`;
        }
        reader.readAsDataURL( image );*/    
    }
     
     // ----------------------------------------------
     // - Lifecycle callbacks
     // ----------------------------------------------

     disconnectedCallback()
     {
     }
 }

 window.customElements.define( 'editor-image', EditorImage );
 
 export { EditorImage };