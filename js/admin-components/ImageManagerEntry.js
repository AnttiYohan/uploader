import { WCBase } from '../WCBase.js';
import { formatBytes } from '../util/elemfactory.js';

/**
 * ImageManagerEntry is an entity entry class,
 * intended to use in the ImageManager store object.
 * 
 * properties:
 * - image category
 * - fullsize image source + meta
 * - thumbnail image source + meta
 * 
 * All the action imputs emit
 * custom events ti signal the ImageManager
 * what kind of actions should be applied for the
 * ImageManagerEntry contents.
 * 
 * @emits ime-thumbnail-generate
 * @emits ime-resize
 * @emits ime-crop
 * @emits ime-viewport
 */
class ImageManagerEntry extends WCBase
{
    constructor( FileEntity, ThumbnailDto )
    {
        super();

        this.mImageFull = FileEntity;
        this.mThumbnail = ThumbnailDto;

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='entry'>
            <div class='entry__row--images'>
              <div class='entry__media-set'>
                <div class='static-row-layout-width-350px'>
                  <div class='entry__frame frame--fullsize'>
                    <img class='entry__image image--fullsize'  src='assets/icon_placeholder.svg'>
                    <div class='frame__arrow arrow--vertical'></div>
                    <div class='frame__arrow arrow--horizontal'></div>
                    <div class='entry__sub-data--fullsize'>
                      <p class='sub-data__row'>some data</p>
                      <p class='sub-data__row'>another set</p>
                    </div>
                  </div>
                </div>
                <div class='entry__frame frame--thumbnail'>
                  <img class='entry__image image--thumbnail' src='assets/icon_placeholder.svg'>
                  <div class='frame__arrow arrow--vertical'></div>
                  <div class='frame__arrow arrow--horizontal'></div>
                  <div class='entry__sub-data--thumbnail'>
                    <p class='sub-data__row row--id-size'></p>
                    <p class='sub-data__row row--name'></p>
                  </div>
                </div>
              </div>
              <div class='entry__actions--stack'>
                <div class='entry__action'></div>
                <div class='entry__frame--action action--image-upload'>
                  <div class='entry__action--select-image'>
                    <img class='entry__preview' src='assets/icon_placeholder.svg'>
                    <input  id='image-upload-input'  class='entry__input--file' type='file' accept='image/*'>
                    <label for='image-upload-input'  class='entry__label--file'></label>
                  </div>
                  <button class='entry__button button--image-upload'>upload</button>
                </div>
              </div>
            </div>
            <div class='entry__row--info'>
              <ul class='entry__info-list--fullsize'>
                <li class='entry__info-row'><span class='field--name'></span><span class='field--id-size'></span></li>
                <li class='entry__info-row'><span class='field--uploaded'></li>
              </ul>
            </div>
          </div>`);
        
        this.setupStyle
         (`
        .entry {
            position: relative;
            width: 100%; 
            min-height: 96px;
            box-shadow: inset 0 -12px 18px -6px rgba(0,0,40,.25);
        }
        .entry__row--images,
        .entry__row--thumbnail-generator {
            padding-left: 0px;
            display: flex;
            transition:
            padding 750ms ease-in-out;
        }
        /**
         * Minimun height when media images are in row
         * (+600px)
         * 144px fullsize img height
         * 8px   fullsize img vt paddings
         * 16px  padding-top
         * 32px  padding-bottom
         * 
         * total: 200px
         */
        .entry__row--images {
            margin: auto;
            max-width: 700px;
            min-height: 200px;
            justify-content: space-between;
        }
        .entry__media-set {
            display: flex;
            width: -webkit-fill-available;
            background-color: #f8f8ff;
            border-bottom: 1px dashed rgba(10, 10, 60, .15);
        }
        .entry__frame {
            position: relative;
            padding: 0;
        }
        .static-row-layout-width-350px {
            width: 350px;
        }
        .frame--fullsize {
            width: fit-content;
            margin-top:   16px;
            margin-left: 60px;
            margin-right: auto;
            transition:
            margin 750ms ease-in-out;
        }
        .frame--fullsize::before {
            position: absolute;
            content: 'height: ${ThumbnailDto.originalImageHeight}px';
            color: rgba(40, 0, 40, .8);
            left: -4em;
            top: 40%;
            width: 20px;
            font-size: 12px;
            transform: rotate3d(3, -2, 1, -45deg);
        }
        .frame--fullsize::after {
            position: absolute;
            content: 'width: ${ThumbnailDto.originalImageWidth}px';
            color: rgba(40, 0, 40, .8);
            left: 31%;
            bottom: -2em;
            font-size: 12px;
        }
        .frame--thumbnail {
            margin: 16px auto auto 16px;
            transition:
            margin 350ms ease-in-out,
            flex-basis 700ms ease-in-out;
        }
        .frame--thumbnail::before {
            position: absolute;
            content: 'height: ${ThumbnailDto.height}px';
            color: rgba(40, 0, 40, .8);
            left: -4em;
            top: 40%;
            width: 20px;
            font-size: 12px;
            transform: rotate3d(3, -2, 1, -45deg);
        }
        .frame--thumbnail::after {
            position: absolute;
            content: 'width: ${ThumbnailDto.width}px';
            color: rgba(40, 0, 40, .8);
            left: 22%;
            bottom: -3em;
            font-size: 12px;
        }
        .entry__image {
            padding: 4px;
            object-fit: contain;
        }
        .image--fullsize {
            height: 144px;
        }
        .image--thumbnail {
            height: 48px;
        }
        .frame__arrow {
            position: absolute;
            background-color: rgba(120, 0, 80, 0.5);
        }
        .arrow--horizontal {
            left: 9px;
            bottom: -8px;
            width: calc(100% - 18px);
            height: 2px;
            transition:
            left   750ms ease-in,
            bottom 500ms ease-in-out,
            width  750ms ease-in;
        }
        .arrow--horizontal::before {
            position: absolute;
            content: '';
            top: -5px;
            left: -12px;
            width: 12px;
            height: 12px;
            clip-path: polygon(0 50%, 100% 0, 100% 100%);
            background-color: rgba(120, 0, 80, .5);
        }
        .arrow--horizontal::after {
            position: absolute;
            content: '';
            top: -5px;
            right: -12px;
            width: 12px;
            height: 12px;
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            background-color: rgba(120, 0, 80, .5);
        }
        .arrow--vertical {
            top: 8px;
            left: -12px;
            width: 2px;
            height: calc(100% - 20px);
            transition:
            top 750ms ease-in,
            left 500ms ease-in-out,
            height 750ms ease-in;
        }
        .arrow--vertical::before {
            position: absolute;
            content: '';
            top: -12px;
            left: -5px;
            width: 12px;
            height: 12px;
            clip-path: polygon(0 100%, 50% 0, 100% 100%);
            background-color: rgba(120, 0, 80, .5);
        }
        .arrow--vertical::after {
            position: absolute;
            content: '';
            bottom: -12px;
            left: -5px;
            width: 12px;
            height: 12px;
            clip-path: polygon(50% 100%, 0 0, 100% 0);
            background-color: rgba(120, 0, 80, .5);
        }
        .entry__sub-data--fullsize,
        .entry__sub-data--thumbnail {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: baseline;
            top: 0;
            left: 100%;
            width: 0px;
            height: 100%;
            padding-left: 8px;
            padding-bottom: 8px;
            transform: translate3d(50vw, 0, 0) scale3d(0, 1, 1);
            transform-origin: left;
            outline: 1px dashed rgba(60, 20, 20, .34);
        }
        .entry__sub-data--thumbnail {
            justify-content: flex-end;
            top: -8px;
            left: -100%;
            width: 300%;
            height: 160px;
            padding-right: 8px;
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
        }
        .sub-data__row {
            font-size: 12px;
            max-height: 24px;
        }
        .entry__actions--stack {
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #f8fdfe;
        }
        .entry__action {
            cursor: pointer;
            position: relative;
            width: calc(100% - 16px);
            min-width: 64px;
            max-width: 128px;
            height: 32px;
            border-radius: 6px;
            background-color: #8080f8;
            box-shadow:
            0 0 7px 0 rgba(0, 0, 50, .25),
            inset 0 8px 11px -5px rgba(255, 255, 255, .4),
            inset 0 -11px 12px -4px rgba(40, 0, 0, .25);
            outline: 2px dashed transparent;
            transition:
            outline-color 400ms;
        }
        .entry__action:focus {
            outline-color: rgba(40, 4, 68, 0.34);
        }
        .entry__frame--action {
            width: fit-content;
            padding: 0;
        }
        .entry__action--select-image {
            position: relative;
            width: 64px;
            height: 64px;
            position: relative;
            border-radius: 5px;
            background-color: #d4d4f8;
        }
        .entry__preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 64px;
            height: 64px;
            object-fit: contain;
        }
        .entry__label--file {
            position: absolute;
            width: 0;
            height: 0;
        }
        .entry__input--file {
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
        .entry__button {
            min-width: 64px;
            height: 32px;
            border-radius: 16px;
            text-align: center;
            background-color: #rgba(64, 10, 64, 0.8);
            color: #fff;
            outline: none;
            border: 0 solid transparent;
            box-shadow: 0 0 9px 0 rgba(0, 0, 60, .25);
        }
        .entry__row--info {
            display: flex;
            padding-top: 16px;
            padding-bottom: 16px;
            background-color: #f8fdfe;
            border-top: 1px solid rgba(0, 0, 7, .25);
            box-shadow:
            inset 0 -12px 16px -13px rgba(60, 0, 0, .45),
            inset 0 3px 15px -4px rgba(0, 0, 86, .35);
        }
        .entry__info-list--fullsize,
        .entry__info-list--thumbnail {
            padding-left: 8px;
            padding-right: 4px;
            list-style-type: none;
        }
        .entry__info-list--fullsize {
            flex-basis: 350px;
        }
        .entry__info-list--thumbnail {
            flex-basis: calc(100% - 350px);
        }
        .entry__info-row {
            display: flex;
            justify-content: space-around;
            align-items: baseline;
        }
        .field--id-size {
            flex-basis: 30%;
            font-size: 12px;
            text-align: end;
        }
        .field--name {
            flex-basis: 70%;
            font-size: 12px;
        }
        .field--uploaded {
            font-size: 12px;
        }
        .entry__row--toolset {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .entry__input--number {
            width: 56px;
            height: 28px;
            outline-color: transparent;
            background-color: #ffd8ef;
            border-radius: 2px;
            border: 1px solid rgba(0, 0, 60, .25);
            padding: 4px;
            color: #444;
            font-size: 12px;
        }
        .action {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 12px;
            width: 32px;
            height: 32px;
            padding: 2px;
            margin-left: 4px;
            background-repeat: no-repeat;
            background-size: cover;
            border: 3px solid rgba(255,80,80,0.7);
            box-shadow: -4px 4px 4px -2 rgba(40,40,128,0.5);
            transition: border-color .3s;
         }
        .action:hover {
            border-color: rgba(0,0,0,.25);
        }
        .action:focus {
            border-color: rgba(255,80,80,0.5);
            outline: none;
        }
        .action:active {
            outline: none;
            border-color: rgba(0, 0, 0, 0.5);
        }
        .action.edit {
            background-image: url('assets/icon_edit.svg');
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
        }
        @media screen and (max-width: 600px) {
            .static-row-layout-width-350px {
                width: fit-content;
                padding-left: 0;
            }
            .frame--fullsize {
                margin: 16px auto 32px 0;
            }
            .frame--thumbnail {
                margin: 16px auto 32px 0;
            }
            .frame--fullsize::before {
                top: 40%;
                left: -4em;
                width: auto;
                transform: rotate3d(0, 0, 1, -90deg);
            }
            .frame--thumbnail::before {
                top: 40%;
                width: auto;
                transform: rotate3d(0, 0, 1, -90deg);
            }
            .arrow--vertical {
                top: 10px;
                left: -2px;
            }
            .arrow--horizontal {
                left: 10px;
                bottom: -2px;
                width: calc(100% - 20px);
            }
            .entry__media-set {
                flex-direction: column-reverse;
                align-items: baseline;
                padding-left: 32px;
            }
            .entry__sub-data--fullsize,
            .entry__sub-data--thumbnail {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: baseline;
                top: 0;
                left: 100%;
                width: 150px;
                height: 100%;
                padding-bottom: 6px;
                margin-left: 6px;
                transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            }
        }
        @media screen and (max-width: 475px) {
            .entry__row--images {
                flex-direction: column-reverse;
                align-items: baseline;
            }
            .entry__actions--stack {
                width: 100%;
                height: 72px;
                flex-direction: row;
            }
            
        }
        
        `); 

        this.mImageFullElement = this.shadowRoot.querySelector( '.image--fullsize' );
        this.mThumbnailElement = this.shadowRoot.querySelector( '.image--thumbnail' );

        /**
         * Grab the fullsize and thumbnail info lists
         */
        const fullsize      = this.shadowRoot.querySelector( '.entry__info-list--fullsize' );
        const thumbnail     = this.shadowRoot.querySelector( '.entry__sub-data--thumbnail' );
        const imagePreview  = this.shadowRoot.querySelector( '.entry__preview' );
        const imageInput    = this.shadowRoot.querySelector( '.entry__input--file' );

        /**
         * Add event listener into the image file input to 
         * detect if the selected image has changed.
         * 
         * When an image file is selected, create a preview
         * of the image
         */
        imageInput.addEventListener( 'change', e => 
        {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('loadend', pe => 
            {
                imagePreview.src = reader.result;
            });
            reader.readAsDataURL(file);
        });

        /**
         * Store the info-list value elements
         * in order to easlizy populate the text contents
         */
        this.mInfo = 
        {
            fullsize: {
                name: fullsize.querySelector( '.field--name' ),
                id_size: fullsize.querySelector( '.field--id-size' )
            },
            thumbnail: {
                name: thumbnail.querySelector( '.row--name' ),
                id_size: thumbnail.querySelector( '.row--id-size' )
            }
        };

        this.mInfo.fullsize.name.textContent = this.mImageFull.fileName;
        this.mInfo.fullsize.id_size.textContent = 
        formatBytes( Number(this.mImageFull.size) ) 
        + ` ID: ${this.mImageFull.file_id}`;

        
        this.mInfo.thumbnail.name.textContent = this.mThumbnail.name;
        this.mInfo.thumbnail.id_size.textContent = 
        formatBytes( Number( this.mThumbnail.size ) ) +
        ' ID: ' + this.mThumbnail.id;
        
    }

    setFullImage()
    {
        if ( this.mImageFull )
        {
            const image = this.mImageFull;
            this.mImageFullElement.src = 
            `data:${image.fileType};base64,${image.data}`;
        }
    }

    setThumbnail()
    {
        if ( this.mThumbnail )
        {
            const image = this.mThumbnail;
            this.mThumbnailElement.src = 
            `data:${image.type};base64,${image.data}`;
        }
    }
    
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        this.setFullImage();
        this.setThumbnail();
    }

    disconnectedCallback()
    {
        console.log("<product-entry> disconnected");
    }
}
 
window.customElements.define( 'image-manager-entry', ImageManagerEntry );

export { ImageManagerEntry };