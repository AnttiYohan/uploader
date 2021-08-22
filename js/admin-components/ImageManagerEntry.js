import { WCBase } from '../WCBase.js';

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
              <div class='entry__frame frame--fullsize'>
                <img class='entry__image image--fullsize'  src='assets/icon_placeholder.svg'>
                <div class='frame__arrow arrow--vertical'></div>
                <div class='frame__arrow arrow--horizontal'></div>
                <div class='entry__sub-data--fullsize'>
                  <p class='sub-data__row'>some data</p>
                  <p class='sub-data__row'>another set</p>
                </div>
              </div>
              <div class='entry__frame frame--thumbnail'>
                <img class='entry__image image--thumbnail' src='assets/icon_placeholder.svg'>
                <div class='frame__arrow arrow--vertical'></div>
                <div class='frame__arrow arrow--horizontal'></div>
                <div class='entry__sub-data--thumbnail'>
                  <p class='sub-data__row'>some data</p>
                  <p class='sub-data__row'>another set</p>
                </div>
              </div>
              <div class='entry__actions--stack'>
                 <div class='entry__action'></div>
                 <div class='entry__action'></div>
              </div>
            </div>
            <div class='entry__row--info'>
              <ul class='entry__info-list--fullsize'>
                <li class='entry__info-row'><span class='key'>Name</span><span class='value value--name'></span></li>
                <li class='entry__info-row'><span class='key'>File id</span><span class='value value--id'></span></li>
              </ul>
              <ul class='entry__info-list--thumbnail'>
                <li class='entry__info-row'><span class='key'>Name</span><span class='value value--name'></span></li>
                <li class='entry__info-row'><span class='key'>Thumbnail id</span><span class='value value--id'></span></li>
              </ul>
            </div>
            <div class='entry__tool-row'>
              <label class='entry__label'>x:
                <input class='entry__input--number' type='number'>
              </label>
              <label class='entry__label'>y:
                <input class='entry__input--number' type='number'>
              </label>
              <label class='entry__label'>width:
                <input class='entry__input--number' type='number'>
              </label>
              <label class='entry__label'>height:
                <input class='entry__input--number' type='number'>
              </label>
              <button class='entry__button'>crop</button>
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
            align-items: center;
            transition:
            padding 750ms ease-in-out;
        }
        .entry__frame {
            position: relative;
            padding: 0;
        }
        .frame--fullsize {
            margin: 16px auto;
            transition:
            margin 750ms ease-in-out;
        }
        .frame--fullsize::before {
            position: absolute;
            content: 'height:\n${ThumbnailDto.originalImageHeight}px';
            color: rgba(40, 0, 40, .5);
            left: -2em;
            top: 0;
            width: 20px;
            min-height: 48px;
        }
        .frame--thumbnail {
            margin: 16px auto auto 16px;
            flex-basis: 100px;
            transition:
            margin 350ms ease-in-out,
            flex-basis 700ms ease-in-out;
        }
        .frame--thumbnail::before {
            position: absolute;
            content: 'height:\n${ThumbnailDto.height}px';
            color: rgba(40, 0, 40, .5);
            left: -2em;
            top: 0;
            width: 20px;
            min-height: 48px;
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
            left: 12px;
            bottom: -12px;
            width: calc(100% - 24px);
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
            top: 6px;
            left: -12px;
            width: 2px;
            height: calc(100% - 18px);
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
            align-items: baseline;
            top: 0;
            left: 100%;
            transform: translate3d(50vw, 0, 0) scale3d(0, 1, 1);
            transform-origin: left;
            width: 0px;
            height: 100%;
        }
        .sub-data__row {
            font-size: 12px;
            max-height: 24px;
        }
        .entry__actions--stack {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 64px;
            height: 96px;
            right: 0;
            transform: translate3d(0, 0, 0) rotateZ(0deg);
            transform-origin: top;
            transition:
            transform 300ms ease-in-out;
        }
        .entry__action {
            cursor: pointer;
            width: 32px;
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
        .entry__row--info {
            display: flex;
            padding-top: 16px;
        }
        .entry__info-list--fullsize {
            flex-basis: 300px;
            padding-left: 64px;
            padding-right: 32px;
            list-style-type: none;
        }
        .entry__info-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }
        .key {
            font-size: 12px;
            font-weight: 600;
            width: 96px;
        }
        .value {
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
        @media screen and (max-width: 650px) {
            
            .frame--thumbnail {
                margin: auto;
            }
            .entry__actions--stack {
                position: absolute;
                transform:
                translate3d(-48px, 0, 0)
                rotateZ(90deg);
            }
        }
        @media screen and (max-width: 600px) {
            .entry__row--images {
                flex-direction: column-reverse;
                align-items: baseline;
                padding-left: 24px;
            }
            .frame--fullsize {
                margin-left: 0;
                margin-right: 0;
            }
            .frame--thumbnail {
                margin: 0;
                flex-basis: 0;
            }
            .arrow--vertical {
                top: 12px;
                left: -3px;
                height: calc(100% - 27px);
            }
            .arrow--horizontal {
                bottom: 0;
            }
            .entry__actions--stack {
                position: absolute;
                top: 0;
                transform:
                translate3d(24px, 0, 0)
                rotateZ(90deg);
            }
            .entry__sub-data--fullsize {
                flex-direction: row;
                flex-wrap: wrap;
                left: 100%;
                width: calc(50vw - 48px);
                transform:
                translate3d(0, 0, 0) scale3d(1, 1, 1);
            }
            .entry__sub-data--thumbnail {
                flex-direction: row;
                flex-wrap: wrap;
                left: 100%;
                width: calc(75vw - 48px);
                transform:
                translate3d(0, 0, 0) scale3d(1, 1, 1);
            }
        }
        
        `); 

        this.mImageFullElement = this.shadowRoot.querySelector( '.image--fullsize' );
        this.mThumbnailElement = this.shadowRoot.querySelector( '.image--thumbnail' );

        /**
         * Grab the fullsize and thumbnail info lists
         */
        const fullsize  = this.shadowRoot.querySelector( '.entry__info-list--fullsize' );
        const thumbnail = this.shadowRoot.querySelector( '.entry__info-list--thumbnail' );
        
        /**
         * Store the info-list value elements
         * in order to easlizy populate the text contents
         */
        this.mInfo = 
        {
            fullsize: {
                name: fullsize.querySelector( '.value--name' ),
                id:   fullsize.querySelector( '.value--id' )
            },
            thumbnail: {
                name: thumbnail.querySelector( '.value--name' ),
                id:   thumbnail.querySelector( '.value--id' )
            }
        };

        this.mInfo.fullsize.name.textContent = this.mImageFull.fileName;
        this.mInfo.fullsize.id.textContent   = this.mImageFull.fileId;

        this.mInfo.thumbnail.name.textContent = this.mThumbnail.name;
        this.mInfo.thumbnail.id.textContent   = this.mThumbnail.id;
        
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