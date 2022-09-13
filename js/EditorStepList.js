import { EditorComponent } from './EditorComponent.js';
import { deleteChildren, newTagClass, newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';

/**
 * Displays the static content of a Step Editor
 * ======================================== 
 */
 class EditorStepList extends EditorComponent
 {
    constructor()
    {
        super();

         // -----------------------------------------------
         // - Setup ShadowDOM and possible local styles
         // -----------------------------------------------
 
        this.attachShadow({mode : "open"});
   
        this.setupTemplate
         (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='component'>
                <div class='component__row current'>
                    <p class='component__label'><slot></p>
                </div>
                <div class='store'>
                </div>
            </div>`);

        this.setupStyle
        (`
        .component__row {
            justify-content: space-between;
        }
        .store .component__row {
            min-height: 64px;
            background-color: #fff;
            border-radius: 8px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 0 8px -3px rgba(0,0,0,0.25);
            margin-bottom: .33em;
        }
        .frame { 
            display: flex;
            flex-basis: 100%;
        }
        .store__field {
            min-width: 64px;
            color: #444;
            font-size: 12px;
            padding: 4px;
            margin-bottom: 2px;
        }
        .store__field.number {
            font-size: 14px;
            background-color: #efefdf;
            min-width: auto;
            width: 23px;
            height: 25px;
            border-radius: 16px;
            border-bottom: 2px solid rgba(0,0,0,0.25);
            text-align: center;
            margin-left: 4px;
            margin-right: 4px;
        }
        .store__field.image {
            width: 64px;
            height: 64px;
            border: 1px solid rgba(0,0,0,0.25);
            border-radius: 5px;
        }
        .store__field.content {
            width: 100%;
            height: 64px;
        }`);

        this.initValueElement
        (
            this.shadowRoot.querySelector('.store')
        );
 
    }

    reset()
    {
        deleteChildren( this.mValueElement );
    }

    addContent( stepList )
    {
        let index = 1;
        for ( const step of stepList )
        {
            const numberField  = newTagClass('p',  'store__field number');
            const imageField   = newTagClass('img', 'store__field image');
            const contentField = newTagClass('p', 'store__field content');
         
            // - Setup the thumbnail
            /*const reader = new FileReader();
            reader.onloadend = (pe) =>
            {
                imageField.style.backgroundImage = `url('${reader.result}')`;
            }
            reader.readAsDataURL(step.image.data);*/

            let image = null;

            if ( step.mediaDto.thumbnail )
            {
                image = step.mediaDto.thumbnail;
            }
            else if ( step.mediaDto.image )
            {
                image = step.mediaDto.image;
            }

            if ( image )
            {
                imageField.src = `data:${image.fileType};base64,${image.data}`;
            }

            // - Setup the content
            contentField.textContent = step.text;
            numberField.textContent  = step.stepNumber;
    
            const row = newTagClassChildren(
                'div',
                'component__row',
                [
                    numberField,
                    imageField,
                    contentField
                ]
            );

            this.mValueElement
                .appendChild( row );

            index++;
        }
    }
}

window.customElements.define( 'editor-step-list', EditorStepList );

export { EditorStepList };