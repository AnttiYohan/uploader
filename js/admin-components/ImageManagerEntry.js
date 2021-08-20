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
    constructor( options = {} )
    {
        super();

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='entry'>
            <div class='entry__row--images'>
              <img class='entry__image--fullsize'  src='assets/icon_placeholder.svg'>
              <img class='entry__image--thumbnail' src='assets/icon_placeholder.svg'>
              <div class='entry__actions--stack'>
                 <div class='entry__action'></div>
                 <div class='entry__action'></div>
              </div>
            </div>
            <div class='entry__row--thumbnail-generator'>
              <label class='entry__label'>
                <input class='entry__input--number' type='text'>
              </label>
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
            display: flex;
            align-items: baseline;
        }
        .entry__image--fullsize,
        .entry__image--thumbnail {
            margin: auto;
            padding: 4px;
            object-fit: cover;
        }
        .entry__image--fullsize {
            height: 96px;
            flex-basis: 50%;
        }
        .entry__image--thumbnail {
            height: 48px;
            flex-basus: 25%;
        }
        .entry__actions--stack {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 32px;
            height: -webkit-fill-available;    
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
        }`); 
    }

    
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
    }

    disconnectedCallback()
    {
        console.log("<product-entry> disconnected");
    }
}
 
window.customElements.define( 'image-manager-entry', ImageManagerEntry );

export { ImageManagerEntry };