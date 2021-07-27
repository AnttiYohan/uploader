import { WCBase, props } from '../WCBase.js';

/**
 * This is an singluar entry element in a Step Editor
 * 
 * @emits
 */
class StepEntry extends WCBase
{
    constructor( options )
    {
        super();

        this.mImageFile = null;

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='entry'>
                <div class='entry__imgframe'>
                    <img src='./assets/icon_placeholder.svg' class='entry__img'/>
                    <input  id='image-upload-input'  class='entry__fileinput' type='file'>
                    <label for='image-upload-input'  class='entry__filelabel'></label>
                </div>
                <textarea class='entry__textarea'></textarea>
                <button class='action remove'></button>
            </div>
        `);
        
        this.setupStyle
         (`
        .entry { 
            display: flex;
            position: relative;
            width: 100%; 
            height: 100px;
            padding: 4px 6px;
            background-color: #fff;
            box-shadow: 0 12px 24px 0 rgba(0,0,0,.25);
        }
        .entry__imgframe { position: relative; margin-right: 4px; }
        .entry__img {
            margin: auto;
            width: 64px;
            height: 64px;
            border-radius: 8px;
            border: 3px dashed #ff8080;
            object-fit: cover;
            transform: scale3d(1,1,1);
            transition: transform .3s;
        }
        .entry__img:hover {
            transform: scale3d(1.2,1.2,1);
        }
        .entry__filelabel {
            position: absolute;
            width: 0;
            height: 0;
        }
        .entry__fileinput {
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
        .entry__textarea {
            padding: 4px;
            border-radius: 6px;
            border-radius: 8px;
            border: 3px solid #ff8080;
            width: 100%;
            height: 100%;
            box-shadow: inset 0 -8px 20px -4px rgba(4,4,20,0.25);
        }
         .action {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 8px;
            width: 32px;
            height: 32px;
            padding: 2px;
            margin-left: 4px;
            background-repeat: no-repeat;
            background-size: cover;
            border: 2px solid transparent;
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


        const imageElement = this.shadowRoot.querySelector( '.entry__img' );
        const inputElement = this.shadowRoot.querySelector( '.entry__fileinput' );
        const removeButton = this.shadowRoot.querySelector( '.action.remove' );
        this.mTextArea     = this.shadowRoot.querySelector( '.entry__textarea' );

        inputElement.addEventListener( 'change', e =>
        {
            this.mImageFile = e.target.files[0];
            const reader    = new FileReader();

            reader.onloadend = () => { imageElement.src = reader.result; }
            reader.readAsDataURL( this.mImageFile );
        });

        removeButton.addEventListener( 'click', e => this.remove() );
         
    }

    /**
     * Return the image and the text content
     * 
     * @return { {string},{File} }
     */
    get value()
    {
        const text  = this.mTextArea.value;
        const image = this.mImageFile;

        return { text, image };
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<step-entry> connected");
    }

    disconnectedCallback()
    {
        console.log("<step-entry> disconnected");
    }
}
 

window.customElements.define( 'step-entry', StepEntry );

export { StepEntry };