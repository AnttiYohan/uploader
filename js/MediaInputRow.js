import { WCBase, props } from './WCBase.js';


/**
 * 
 */
class MediaInputRow extends WCBase
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
                    <div class='component__frame'>
                      <p class='component__label'><slot></p>
                      <div class='component__img--required'></div>
                    </div>
                    <button class='button--reset'>Reset</button>
                </div>
                <div class='image__area main'>
                    <input  id='image-upload-input'  class='image__file' type='file'>
                    <label for='image-upload-input'  class='image__label'></label>
                </div>
                <div class='component__row'>
                    <div class='component__column width--48px'>
                        <div class='image__area thumbnail--48px'>
                            <input  id='thumbnail-upload-input--48px'  class='image__file' type='file'>
                            <label for='thumbnail-upload-input--48px'  class='image__label'></label>
                            <button class='remove'></button>
                        </div>
                        <p class='component__label'>48px</p>
                    </div>
                    <div class='component__column width--96px'>
                        <div class='image__area thumbnail--96px'>
                            <input  id='thumbnail-upload-input--96px'  class='image__file' type='file'>
                            <label for='thumbnail-upload-input--96px'  class='image__label'></label>
                            <button class='remove'><button>
                        </div>
                        <p class='component__label'>96px</p>
                    </div>
                    <div class='component__column width--144px'>
                        <div class='image__area thumbnail--144px'>
                            <input  id='thumbnail-upload-input--144px'  class='image__file' type='file'>
                            <label for='thumbnail-upload-input--144px'  class='image__label'></label>
                            <button class='remove'><button>
                        </div>
                        <p class='component__label'>144px</p>
                    </div>
                    <div class='component__column width--288px'>
                        <div class='image__area thumbnail--288px'>
                            <input  id='thumbnail-upload-input--288px'  class='image__file' type='file'>
                            <label for='thumbnail-upload-input--288px'  class='image__label'></label>
                            <button class='remove'><button>
                        </div>
                        <p class='component__label'>288px</p>
                    </div>
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
                margin: 0 auto auto 0;
                position: relative;
                border: 1px solid ${props.color.grey};
                border-radius: 2px;
                width: 300px;
                height: 300px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: url('assets/icon_image_input.svg');
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center center;
            }
            .image__area.main { margin-bottom: 16px; }
            .image__area.focus {
                border: 2px solid #656565;
                height: 298px;
            }
            .image__area:hover {
                background-size: 98%;
            }
            .image__area.notify-required {
                border: 2px solid ${props.red};
                height: 298px;
            }
            .image__area .remove {
                cursor: pointer;
                position: absolute;
                width: 20px;
                height: 20px;
                top: -10px;
                right: -10px;
                border-radius: 10px;
                background-color: #80003f;
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
                background-image: url( 'assets/icon_undo.svg' );
                border-width: 0;
                outline: none;
                transition: background-color .3s;
            }
            .image__area .remove:hover {
                background-color: #ff0080;
            }
            .image__area.thumbnail--48px { width: 24px; height: 24px; }
            .image__area.thumbnail--48px.focus { height: 22px; }
            .image__area.thumbnail--96px { width: 48px; height: 48px; }
            .image__area.thumbnail--96px.focus { height: 46px; }
            .image__area.thumbnail--144px { width: 77px; height: 77px; }
            .image__area.thumbnail--144px.focus { height: 75px; }
            .image__area.thumbnail--288px { width: 144px; height: 144px; }
            .image__area.thumbnail--288px.focus { height: 142px; }
            
            .component__row { flex-wrap: wrap; }
            .component__column { margin: 0 auto auto 0; }
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
        this.mAsterisk = asterisk;

        /**
         * Reset button
         */
        const resetButton = this.shadowRoot.querySelector('.button--reset');
        resetButton.addEventListener('click', e => { this.reset(); });

        /**
         * Main image input element
         */
        this.mArea  = this.shadowRoot.querySelector('.image__area.main');
        this.mInput = this.mArea.querySelector('.image__file');

        /**
         * Thumbnails are handlen in an array
         */
        this.mThumbnails = [];

        /**
         * Parse the thumbnail input elements
         */
        for ( const size of [ 48, 96, 144, 288 ] )
        {
            const area = this.shadowRoot.querySelector( `.image__area.thumbnail--${size}px` ); 
            if ( area )
            {
                const input = area.querySelector('.image__file');
                const removeButton = area.querySelector('.remove');

                if ( input )
                {
                    this.mThumbnails.push({ area, input, size });

                    /**
                     * Observe image selection
                     */
                    input.addEventListener( 'change', e => 
                    {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = (pe) =>
                        {
                            area.style.backgroundImage = `url('${reader.result}')`;
                        }
                        reader.readAsDataURL(file);
                    });
                }

                if ( removeButton )
                {
                    removeButton.addEventListener('click', e =>
                    {
                        input.value = '';
                        area.style.backgroundImage = `url('assets/icon_image_input.svg')`;
                    });
                }
            }
        }
    

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
        const list = [];

        /**
         * Grab the main image, if not set,
         * return undefined
         */
        if ('files' in this.mInput && this.mInput.files.length)
        {
            list.push( { 'image': this.mInput.files[0], 'size': 1000 } );
        }
        else return undefined;

        /**
         * Append the thumbnails
         */
        for ( const thumbnail of this.mThumbnails )
        {
            const { input, size } = thumbnail;

            if ( 'files' in input && input.files.length )
            {
                list.push( { image: input.files[0], size } );
            }
        }

        return list.length ? list : undefined; 
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
        return true;
    }

    /**
     * Clears the thumbnail and the file input
     */
    reset()
    {
        this.mInput.value = '';
        this.mArea.classList.remove('notify-required');
        this.mArea.style.backgroundImage = `url('assets/icon_image_input.svg')`;
        this.mAsterisk.style.display = 'block';

        for ( const thumbnail of this.mThumbnails )
        {
            const { input, area } = thumbnail;

            input.value = '';
            area.style.backgroundImage = `url('assets/icon_image_input.svg')`;
        }
    }

    /**
     * Adds a class into the image area element, to display
     * a red border -- when ensure is set,
     * the notificatio fires only when the input is not set
     * ------
     * @param {boolean} ensure
     */
    notifyRequired(ensure = true)
    {
        if ( ! ensure || ! this.value ) this.mNotifier.classList.add('notify-required');
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<media-input-row> connected");
    }

    disconnectedCallback()
    {
        console.log("<media-input-row> disconnected");
    }  
}

window.customElements.define('media-input-row', MediaInputRow );

export { MediaInputRow };