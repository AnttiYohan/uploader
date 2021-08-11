import { WCBase, props } from '../WCBase.js';

/**
 * This is an singluar entry element in a Step Editor
 * 
 * @emits
 */
class StepEntry extends WCBase
{
    constructor( options = {} )
    {
        super();

        /**
         * Check whether there are values passed in the constructor params
         */
        this.mText       = 'text'      in options ? options.text            : '';
        this.mImage      = 'mediaDto'  in options ? options.mediaDto.image  : null;
        this.mStepNumber = 'stepNumer' in options ? options.stepNumber      : 0;
        
        this.draggable = true;
        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
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
         :host {
            border: 2px solid transparent;
         }
         :host(.dragged) {
             border: 2px solid rgba(0, 0, 0, .25);
         }
        .entry { 
            display: flex;
            position: relative;
            width: 100%; 
            height: 114px;
            padding: 12px 6px;
            background-color: #fff;
            border-top: 1px solid rgba(0,0,0,0.25);
        }
        .entry__imgframe { 
            position: relative; margin-right: 10px; height: auto;
        }
        .entry__imgframe:focus-within .entry__img {
            border: 3px solid #f04040;
            box-shadow: 0 0 8px 2px rgba(240,80,80,0.5);
        }
        .entry__img {
            margin: auto;
            width: 64px;
            height: 64px;
            border-radius: 8px;
            border: 3px dashed #ff8080;
            object-fit: cover;
            transform: scale3D(1,1,1);
            transition: transform .3s, box-shadow .3s;
        }
        .entry__img:hover {
            transform: scale3D(1.2,1.2,1);
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
            height: 64px;
        }
        .entry__fileinput:focus + .entry__img {
            border: 3px solid rgba(240, 80, 80, 1);
        }
        .entry__fileinput:active + .entry__img {
            border: 3px ridge rgba(240, 80, 80, 1);
        }
        .entry__fileinput:target + .entry__img {
            border: 5px ridge rgba(40, 80, 240, 0.6);
        }
        .entry__textarea {
            padding: 4px;
            border-radius: 6px;
            border-radius: 8px;
            border: 3px solid #ff8080;
            width: calc(100% - 77px);
            height: 100%;
            box-shadow: inset 0 -8px 20px -4px rgba(4,4,20,0.25);
        }
        .entry__textarea:active,
        .entry__textarea:focus {
            outline: none;
            border-color: #555;
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
            transition: border-color 300ms, transform 300ms;
         }
        .action:hover {
            transform: scale3D(1.2,1.2,1);
        }
        .action:focus {
            border-color: #555;
            outline: none;
        }
        .action:active {
            outline: none;
            border-color: #555;
        }
        .action.edit {
            background-image: url('assets/icon_edit.svg');
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
        }`);


        const inputElement = this.shadowRoot.querySelector( '.entry__fileinput' );
        const removeButton = this.shadowRoot.querySelector( '.action.remove' );
        this.mImageElement = this.shadowRoot.querySelector( '.entry__img' );
        this.mTextArea     = this.shadowRoot.querySelector( '.entry__textarea' );

        inputElement.addEventListener( 'change', e =>
        {
            this.mImage  = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => { this.mImageElement.src = reader.result; }
            reader.readAsDataURL( this.mImage );
        });

        removeButton.addEventListener( 'click', e => this.remove() );
         
        this.addEventListener( 'dragstart', e =>
        {
            console.log( `Drag start, ${e.target}` );
            //console.table(e.target);
            e.dataTransfer.setData( 'text', this.stepNumber );
        });

        /*
        this.addEventListener( 'dragend', e =>
        {
            console.log( `Drag stop, ${e.target}` );
            //console.table(e);
            const data = e.dataTransfer.getData( 'text' );
            console.log( `Data: ${data}` );
            //e.dataTransfer.setData( 'text', '434124' );
        });*/
    }

    /**
     * Return the image and the text content
     * 
     * @return {{string},{File},{number}}
     */
    get value()
    {
        return {

            text:       this.text, 
            image:      this.image, 
            stepNumber: this.stepNumber

        };
    }

    // -------------------------------------------
    // - 
    // - Accessor methods for step properties:
    // - 1) Text
    // - 2) Image 
    // - 3) Step Number
    // -
    // -------------------------------------------

    get text()
    {
        return this.mTextArea.value;
    }

    get image()
    {
        return this.mImage;
    }

    get stepNumber()
    {
        return this.mStepNumber;
    }

    set text( value )
    {
        this.mTextArea.value = value;
    }

    setImage( obj )
    {
        if ( ! obj.hasOwnProperty( 'data' ) ) return;
        
        const byteString = atob( obj.data );
        let   index      = byteString.length;
        const byteArray  = new Uint8Array( index );
        
        while ( index-- )
        {
            byteArray[ index ] = byteString.charCodeAt( index );
        }

        const file = new File( [ byteArray ], obj.fileName, { type: obj.fileType } );
        this.mImage = file;

        const reader = new FileReader();
        reader.onloadend = () => { this.mImageElement.src = reader.result; }
        reader.readAsDataURL( file );
    }

    set stepNumber( value )
    {
        this.mStepNumber = value;
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        this.emit( 'step-entry-connected' );
        console.log("<step-entry> connected");

        if ( this.mText && this.mImage )
        {
            this.text  = this.mText;
            this.setImage( this.mImage );
        }
    }

    disconnectedCallback()
    {
        this.emit( 'step-entry-disconnected' );
        console.log("<step-entry> disconnected");
    }
}
 

window.customElements.define( 'step-entry', StepEntry );

export { StepEntry };