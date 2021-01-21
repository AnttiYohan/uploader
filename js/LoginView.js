import { WCBase, props } from './WCBase.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='login'>
  <label class='login__label' for="email">email:</label>
  <input class='login__input--email'    type='text'     name='email' />
  <label class='login__label' for="password">password:</label>
  <input class='login__input--password' type='password' name='password' />
  <button class='login__button'>login</button>
  <div class='login__response'></div>
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

        this.mToken = '';

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
            flex-direction: column;
            margin: 16px auto;
            max-width: 400px;
            width: 50%;
            height: fit-content;
        }
        .login__label {
            color: #888;
            font-weight: 200;
            height: ${props.lineHeight};
        }
        .login__input {
            background-color: ${props.inputBg};
            color: ${props.inputColor};
            border-bottom: 2px solid ${props.inputBorderGlare};
            height: ${props.lineHeight};
        }
        .login__button {
            cursor: pointer;
            margin-top: 16px;
            font-weight: 200;
            height: ${props.lineHeight};
            color: ${props.buttonColor};
            background-color: ${props.buttonBg};
        }
        .login__response {
            margin: 16px auto;
            color: #f45;
            font-weight: 200;
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

        const emailInput    = this.shadowRoot.querySelector('.login__input--email');
        const passwordInput = this.shadowRoot.querySelector('.login__input--password');
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
                //'https://babyfoodworld.app/perform_login',
                'http://localhost:8080/perform_login',
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

}

window.customElements.define('login-view', LoginView);