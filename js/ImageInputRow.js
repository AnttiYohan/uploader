import { WCBase, props } from './WCBase.js';
import { setImageFileInputThumbnail, setImageThumbnail } from './util/elemfactory.js';

/**
 * 
 */
class ImageInputRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
              <div class='component__row'>
                <p class='component__label'><slot></p>
                <div class='component__img--required'></div>
              </div>
              <div class='image__area'>
                <input  id='image-upload-input'  class='image__file' type='file'>
                <label for='image-upload-input'  class='image__label'>.</label>
              </div>
            </div>
        `);

        this.setupStyle
        (`
            .image {
                display: flex;
                justify-content: space-between;
                display: flex;
                padding: ${props.uploader_row_pad};
                border-bottom: 1px solid ${props.lightgrey};
            }
            .image__title {
                color: #222;
                font-size: 14px;
                font-weight: 200;
            }
            .image__thumbnail {
                width: 48px;
                height: 48px;
                position: absolute;
                transform: translate3d(48px, 28px, 0);
            }
            .image__area {
                border: 1px solid ${props.color.grey};
                width: ${props.input_width};
                height: 96px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .image__area.notify-required {
                border: 2px solid ${props.red};
                width: ${props.input_width};
                height: 94px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .image__label {
                cursor: pointer;
                width: 32px;
                height: 32px;
                background-image: url('assets/icon_image_input.svg');
                background-repeat: no-repeat;
            }
            .image__file {
                position: absolute;
                appearance: none;
                opacity: 0;
                z-index: -10;
            }
            .image__file:focus ~ .image__label {
                outline: 3px solid ${props.darkgrey};
                /*border-radius: 2px;
                border: 2px solid rgba(0,0,0,0.66);*/
            }
        `);

        // ---------------------------
        // - Grab the input
        // ---------------------------
        const asterisk = this.shadowRoot.querySelector('.component__img--required');
        this.mArea  = this.shadowRoot.querySelector('.image__area');
        this.mImage = this.shadowRoot.querySelector('.image__thumbnail')
        this.mInput = this.shadowRoot.querySelector('.image__file');

        setImageFileInputThumbnail(this.mInput, this.mImage);

        // -------------------------------
        // - Observe image selection
        // -------------------------------

        this.mInput.addEventListener('change', e => 
        {
            if (this.mInput.files.length)
            {
                if (this.mInput.classList.contains('notify-required'))
                {
                    this.mInput.classList.remove('notify-required');
                }

                if (asterisk.style.display !== 'none')
                {
                    asterisk.style.display = 'none';
                }
            }
            else
            {
                asterisk.style.display = 'initial';
            }
        });
    }

    /**
     * Returns the first available file
     * ================================
     * @return {File}
     */
    get value() 
    {

        if ('files' in this.mInput && this.mInput.files.length)
        {
            return this.mInput.files[0];
        }

        return null; 
    }

    /**
     * Clears the thumbnail and the file input
     */
    reset()
    {
        this.mInput.value = '';
        setImageThumbnail(this.mImage, 'assets/icon_placeholder.svg');
    }

     /**
     * Adds a class into the input, which sets a red border,
     * In order to display that the input must be filled
     */
      notifyRequired()
      {
          this.mInput.classList.add('notify-required');
      }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<image-input-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<image-input-row> disconnected");
    }  
}

window.customElements.define('image-input-row', ImageInputRow );

export { ImageInputRow };