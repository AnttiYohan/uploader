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
                <label for='image-upload-input'  class='image__label'></label>
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
                position: relative;
                border: 1px solid ${props.color.grey};
                border-radius: 2px;
                width: ${props.input_width};
                height: 96px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: url('assets/icon_image_input.svg');
                background-repeat: no-repeat;
                background-size: 75px;
                background-position: center center;
            }
            .image__area.focus {
                border: 2px solid #656565;
                height: 94px;
            }
            .image__area:hover {
                background-size: 78px;
            }
            .image__area.notify-required {
                border: 2px solid ${props.red};
                height: 94px;
            }
            .thumbnail {
                /*cursor: pointer;*/
                width: 48px;
                height: 48px;
                background-image: url('assets/icon_image_input.svg');
                background-repeat: no-repeat;
                background-size: cover;
            }
            .image__label {
                position: absolute;
                width: 0;
                height: 0;
            }
            .image__file {
                cursor: pointer;
                position: absolute;
                appearance: none;
                opacity: 0;
                z-index: 10;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .image__file:focus ~ .thumbnail {
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
        this.mInput = this.shadowRoot.querySelector('.image__file');

        // -------------------------------
        // - Observe input focus/blur
        // -------------------------------
        this.mInput.addEventListener('focus', e =>
        {
            this.mArea.classList.add('focus');
        });

        this.mInput.addEventListener('blur', e =>
        {
            this.mArea.classList.remove('focus');
        });

        // -------------------------------
        // - Observe image selection
        // -------------------------------

        this.mInput.addEventListener('change', e => 
        {
            if (this.mInput.files.length)
            {
                if (this.mArea.classList.contains('notify-required'))
                {
                    this.mArea.classList.remove('notify-required');
                }

                if (asterisk.style.display !== 'none')
                {
                    asterisk.style.display = 'none';
                }
                //const url = URL.createObjectURL(e.target.files[0]);
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = (pe) =>
                {
                    this.mArea.style.backgroundImage = `url('${reader.result}')`;
                    this.mArea.style.backgroundSize = `100%`;
                }
                reader.readAsDataURL(file);
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

        return undefined; 
    }

    /**
     * Clears the thumbnail and the file input
     */
    reset()
    {
        this.mInput.value = '';
        this.mArea.classList.remove('notify-required');
        this.mArea.style.backgroundImage = `url('assets/icon_image_input.svg')`;
        this.mArea.style.backgroundSize = `50%`;
        //setImageThumbnail(this.mImage, 'assets/icon_placeholder.svg');
    }

    /**
     * Adds a class into the image area element, to display
     * a red border
     */
     notifyRequired()
    {
          this.mArea.classList.add('notify-required');
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