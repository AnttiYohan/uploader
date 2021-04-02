import { WCBase, props } from './WCBase.js';
import { setImageFileInputThumbnail } from './util/elemfactory.js';

/**
 * 
 */
class ImageInputRow extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------


        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        /*this.setupStyle
        (`
        .row {
            display: flex;
            justify-content: space-between;
            height: ${props.uploader_row_height};
            padding: ${props.uploader_row_pad};
            border-bottom: 1px solid ${props.lightgrey};
        }
        .row__image {
            width: ${props.thumbnail_side}; 
            height: ${props.thumbnail_side};
            border-radius: 4px;
            box-shadow: 0 1px 15px 0 rgba(0,0,0,0.25);
        }
        .row__imagearea {
            position: relative;
        }
        .row__filelabel {
            display: inline-block;
            cursor: pointer;
            background-color: ${props.green};
            background-image: url('assets/icon_publish.svg');
            background-repeat: no-repeat;
            background-position-x: right;
            border-radius: 4px;
            border: 2px solid rgba(0, 0, 0, 0.33);
            padding: 5px 0 0 0;
            width: ${props.input_width};
            height: ${props.row_input_height};
            font-size: ${props.header_font_size};
            font-weight: 500;
            color: #fff;
            text-align: center;
            text-shadow: 0 0 2px #000;
            box-shadow: 0 1px 7px 1px rgba(0,0,0,0.25);
        }
        .row__file {
            position: absolute;
            appeareance: none;
            z-index: -1;
            opacity: 0;
        }`);*/

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='image'>
              <p class='image__title'>Product Image</p>
              <img class='image__thumbnail' src='assets/icon_placeholder.svg' />
              <div class='image__area'>
                <label for='image-upload-input'  class='image__label'>.</label>
                <input  id='image-upload-input'  class='image__file' type='file'>
              </div>
            </div>
        `);

        this.setupStyle
        (`
            .image {
                height: 96px;
                display: flex;
                justify-content: space-between;
            }
            .image__title {
                padding-left: 4px;
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
                margin-right: 9px;
                width: ${props.input_width};
                height: 96px;
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
                appereance: none;
                opacity: 0;
                z-index: -10;
            }
        `);

        /*
        this.setupTemplate
        (`<div class='row'>
            <img src='assets/icon_placeholder.svg'  class='row__image' />
            <div class='row__imagearea'>
                <label for='image-upload-input'  class='row__filelabel'>image upload</label>
                <input  id='image-upload-input'  class='row__file' type='file'>
            </div>
        </div>`);
        */
        // ---------------------------
        // - Grab the input
        // ---------------------------

        const image = this.shadowRoot.querySelector('.image__thumbnail')
        this.mInput = this.shadowRoot.querySelector('.image__file');

        setImageFileInputThumbnail(this.mInput, image);
    }

    get value() 
    {
        return this.mInput.value;
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