import { EditorComponent } from './EditorComponent.js';
import { newTagClassHTML } from './util/elemfactory.js';
import { props } from './WCBase.js';

/**
 * Text Input Row, with old value on the left
 * Side. For editors.
 * ======================================== 
 */
 class EditorSwitchGroup extends EditorComponent
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
                <div class='group'>
                </div>
            </div>`);

        this.setupStyle
        (`.group {
            display: flex;
            flex-flow: wrap;
        }
        .switch {
            cursor: pointer;
            word-wrap: break-word;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            width: 78px;
            margin-right: 4px;
            height: 48px;
            border: 1px solid ${props.color.dark};
            border-radius: 4px;
            color: #ffffff;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            background-color: ${props.color.light};
            font-weight: 200;
            transition: background-color .15s, color .15s;
        }
        .switch:focus,
        .switch:active {
            outline: none;
            border: 2px solid ${props.color.dark};
            height: 46px;
        }
        .switch.active {
            background-color: ${props.color.grey};
            font-weight: 400;
        }`);
        /*
         this.setupStyle
          (`.component__value {
             background-color: #fff;
             border-radius: 4px;
             border: 1px solid rgba(0,0,0,0.133);
             box-shadow: 0 3px 12px -5px rgba(0,0,0,0.25);
             width: 100%;
          }`);*/

        this.initValueElement
        (
            this.shadowRoot.querySelector('.group')
        );
 
    }

    addContent( switchGroup )
    {
        for ( const switchItem of switchGroup )
        {
            const element = newTagClassHTML(
                'div',
                'switch active',
                switchItem.name
            );

            this.mValueElement
                .appendChild( element );
        }
    }    
}

window.customElements.define( 'editor-switch-group', EditorSwitchGroup );
 
export { EditorSwitchGroup };