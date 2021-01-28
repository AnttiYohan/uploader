import { UploaderView } from './UploaderView.js';
import { deleteChildren } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { WCBase, props, LOGIN_URL } from './WCBase.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='login'>
    <div class='login__rowset root_frame'>
  
        <div class='login__frame'>
            <div class='login__row'>
                <label class='login__label' for="email">email:</label>
                <input class='login__input email'    type='text'     name='email' />
            </div>
            <div class='login__row'>
                <label class='login__label' for="password">password:</label>
                <input class='login__input password' type='password' name='password' />
            </div>
        </div>
        <div class='login__frame'>
          <button class='login__button'></button>
        </div>
    </div>
</div>`;

/**
 * 
 */
class LoginView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        const token = localStorage.getItem('token');
        this.mUploaderView = new UploaderView(this, token);

        if (token && token.length)
        {
            console.log(`Token found: ${token}`);
            this.mToken = token;
            FileCache.setToken(token);
        }
        else
        {
            console.log(`Token not found`);
        }
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
        .login {
            display: flex;
            width: 500px;
            height: 80vh;
            margin: 100px auto;
        }
        .editor__subheader {
            font-size: ${props.header_font_size};
            color: ${props.darkgrey};
        }
        .login__division {
            height: ${props.lineHeight};
            padding: 8px 0;
            background-color: ${props.disabled};
        }
        .login__frame {
            display: flex;
            flex-direction: column;
            margin: 16px auto;
        }
        .login__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .login__row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .login__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: ${props.lineHeight};
        }
        .login__button {
            margin: 24px 32px;
            cursor: pointer;
            width: 48px;
            height: 48px;
            border-radius: 14px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            bdeackground-image: url('assets/icon_account.svg');
        }
        `);

        if (token && token.length)
        {
            console.log(`Token length: ${token.length}`);
            this.shadowRoot.appendChild(this.mUploaderView);
            return;
        }
        else
        {
            console.log(`Token undefined`);
        }

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mRootElement = this.shadowRoot.querySelector('.login');

        // ----------------------------------------------------------------
        // - Define event listeners to listen for TableView's custom events
        // ----------------------------------------------------------------

        // ---------------------------
        // - Setup login functionality
        // ---------------------------

        const mRootFrame    = this.shadowRoot.querySelector('.login__rowset.root_frame');
        const emailInput    = this.shadowRoot.querySelector('.login__input.email');
        const passwordInput = this.shadowRoot.querySelector('.login__input.password');
        const button        = this.shadowRoot.querySelector('.login__button');

        const context = this;

        button.addEventListener
        ('click', e => {

            const email     = emailInput.value;
            const password  = passwordInput.value;

            LoginView
                .performLogin(email, password)
                .then(response => {

                    console.log(`Login response: ${response}`);

                    const json = JSON.parse(response);

                    if (json) for (let key in json)
                    {
                        console.log(`key: ${key}, value: ${json[key]}`);
                        this.handleResponse(json);
                    }

                   
                })
                 .catch(error => { console.log(`Login fail: ${error}`); } );

        });

    }

    handleResponse(json)
    {
        if (json.hasOwnProperty('token'))
        {
            const token = json['token'];

            // - Store token to the localstorage

            localStorage.setItem('token', token);

            // ------------------------------------
            // - Notify the uploaderview to refresh
            // ------------------------------------

            window.dispatchEvent( new CustomEvent("login-event") );

            // ------------------------------------
            // - Turn login off
            // ------------------------------------
            
            deleteChildren(this.shadowRoot);

            this.shadowRoot.appendChild(this.mUploaderView);
            
        }
    }
    /**
     * Builds and executes the perform_login HTTP Request
     * from Babyfoodworld API
     * 
     * @param {string} email 
     * @param {string} password 
     */
    static async performLogin(email, password)
    {
        if ( email.length > 1 && password.length > 5 )
        {
            const 
            formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch
            (
                LOGIN_URL,
                {
                    method: 'POST',
                    /*credentials: 'include',*/
                    /*mode: 'no-cors',*/
                    body: formData
                }
            );
            
            return await response.text();
        }

        return undefined;
    }

    // ----------------------------------------------
    // - Update method section
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("LoginView::callback connected");
    }

    disconnectedCallback()
    {
        console.log("LoginView::callback connected");
    }  

}

window.customElements.define('login-view', LoginView);

export { LoginView };