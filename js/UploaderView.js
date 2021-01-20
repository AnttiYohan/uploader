import { WCBase, props } from './WCBase.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='uploader'>
  <header>
    <h3>uploader</h3>
  </header>
</div>`;

/**
 * 
 */
class UploaderView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        this.mToken = '';
        this.mDisplay = 'none';

        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
        this.setupStyle
        (`* {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .clickable {
            cursor: pointer;
        }
        .zoomable {
            transition: transform .15s ease-in-out;
        }
        .zoomable:hover {
            transform: scale3D(1.1, 1.1, 1.1);
        }
        .uploader {
            display: ${this.mDisplay};
            display: flex;
            flex-direction: column;
            margin: 16px auto;
            max-width: 1400px;
            height: fit-content;
        }
        .uploader__button {
            margin-top: 16px;
            font-weight: 200;
            height: ${props.lineHeight};
            color: ${props.buttonColor};
            background-color: ${props.buttonBg};
        }
        .uploader__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        // ----------------------------------------------------------------
        // - Define event listeners to listen for TableView's custom events
        // ----------------------------------------------------------------

        // ---------------------------
        // - Setup login functionality
        // ---------------------------

        const button        = this.shadowRoot.querySelector('.uploader__button');
    }

}

window.customElements.define('uploader-view', UploaderView);