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
                <input class='login__input email' type='text' name='email' required/>
                <label class='login__label' for="email">email</label>
            </div>
            <div class='login__row'>
                <input class='login__input password' type='password' name='password' required/>
                <label class='login__label' for="password">password</label>
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

        if (token && token.length)
        {
            console.log(`Token found: ${token}`);
            this.mToken = token;
            FileCache.setToken(token);

            // - Send ensure request

            // - Start UploaderView and shut this view down
            deleteChildren(document.body);
            document.body.appendChild(new UploaderView(token));
            this.remove();
            console.log(`LoginView: token found, terminated loginview, uploaderview at body root.`);
            console.log(`Token: ${token}`);
            return;
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
            width: fit-content;
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
        }
        .login__row:first-of-type {
            border-bottom: 1px solid ${props.lightgrey};            
        }
        .login__label {
            position: absolute;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #888;
            transform: translate(8px, 16px) scale3d(1, 1, 1);
            transition: transform 0.25s, color 0.5s;
        }
        .login__input {
            background-color: #eef;
            width: 192px;
            height: 32px;
            padding: 0 8px;
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            border: none;
            border-radius: 2px;
            border-bottom: 1px solid rgba(0,0,0,.25);
            align-self: center;
        }
        .login__input:focus {
            outline: none;
            box-shadow: 0 1px 8px 1px rgba(0,0,0,.2);
        }
        .login__input:valid ~ .login__label,
        .login__input:focus ~ .login__label {
            transform: translate(4px, 0px) scale3D(.8,.8,.8);
            color: #333;
        }
        .login__button {
            margin: 16px;
            cursor: pointer;
            width: 64px;
            height: 64px;
            border-radius: 10px;
            border: 2px solid #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_account.svg');
            box-shadow: 0 1px 12px 2px rgba(0,0,0,0.25);
        }
        `);

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

        const emailInput    = this.shadowRoot.querySelector('.login__input.email');
        const passwordInput = this.shadowRoot.querySelector('.login__input.password');
        const button        = this.shadowRoot.querySelector('.login__button');

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
            FileCache.setToken(token);

            // -----------------------------------
            // - NEW SYSTEM, ANCHOR UploaderView
            // - into the document body
            // - Remove this LoginView completely
            // -----------------------------------

            deleteChildren(document.body);
            document.body.appendChild(new UploaderView(token));
            this.remove();
            return;
            
            /* OLD SYSTEM
            // ------------------------------------
            // - Notify the uploaderview to refresh
            // ------------------------------------

            window.dispatchEvent( new CustomEvent("login-event") );

            // ------------------------------------
            // - Turn login off
            // ------------------------------------
            
            deleteChildren(this.shadowRoot);

            this.shadowRoot.appendChild(this.mUploaderView);*/
            
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
        console.log("LoginView - connected");
    }

    disconnectedCallback()
    {
        console.log("LoginView - disconnected");
    }  

}

window.customElements.define('login-view', LoginView);

export { LoginView };