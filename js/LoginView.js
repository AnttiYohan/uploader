import { UploaderView } from './UploaderView.js';
import { deleteChildren } from './util/elemfactory.js';
import { FileCache } from './util/FileCache.js';
import { WCBase, props, LOGIN_URL, AUTH_STATUS_URL } from './WCBase.js';


/**
 * This is a Login Form View, the root view of the app
 */
class LoginView extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------

        const token = FileCache.getToken()

        if ( token && token.length )
        {
            console.log( `Token found: ${token}` );
            this.mToken = token;

            deleteChildren(document.body);
            document.body.appendChild(new UploaderView(token));
            this.remove();
            console.log(`LoginView: token found, terminated loginview, uploaderview at body root.`);
            return;    


            /** Test the token */
/*            LoginView
            .checkAuthStatus()
            .then( status => 
            {
                console.log( `LoginView status: ${status}` );
                if ( status != 403 )
                {
                    deleteChildren(document.body);
                    document.body.appendChild(new UploaderView(token));
                    this.remove();
                    console.log(`LoginView: token found, terminated loginview, uploaderview at body root.`);
                    return;    
                }
            })
            .catch( error => console.log( `LoginView::constructor error: ${error}` ) );*/
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
        this.setupTemplate(
       `<div class='login'>
            <div class='login__rowset login_form'>
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
            <div class='notification__frame'>
                <p class='notification__text'></p>
            </div>
        </div>`
        );
    
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
        .notification__frame {
            max-width: 200px;
            margin: 16px auto;
        }
        .notification__text {
            font-size: ${props.text_font_size};
            font-weight: 400;
            color: #980012;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.25);
        }
        `);

        // ---------------------------
        // - Save element references
        // ---------------------------
        this.mRootElement       = this.shadowRoot.querySelector('.login');
        this.mNotificationText  = this.shadowRoot.querySelector('.notification__text');
    
        // ---------------------------
        // - Setup login functionality
        // ---------------------------
        this.mEmailInput    = this.shadowRoot.querySelector('.login__input.email');
        this.mPasswordInput = this.shadowRoot.querySelector('.login__input.password');
        const button        = this.shadowRoot.querySelector('.login__button');

        // -----------------------------------------------------------------
        // - Add a focus listener fot email in order to empty the possible
        // - Error message when new login attempt begins
        // -----------------------------------------------------------------
        this.mEmailInput.addEventListener
        ('focus', e => 
        {
            this.mNotificationText.textContent = '';
        });

        const handler = () => 
        {
            LoginView.performLogin( this.mEmailInput.value, this.mPasswordInput )
            .then( response => this.handleResponse( JSON.parse( response ) ) )
            .catch( error => this.displayLoginFail( 'Invalid credentials.' ) );
        }

        this.shadowRoot.addEventListener( 'keydown', e => 
        {
            if ( e.keyCode === this.ENTER ) handler();
        });

        button.addEventListener( 'click', e => handler() );

    }

    handleResponse( json )
    {
        if ( json && json.hasOwnProperty( 'token' ) )
        {
            const token = json.token;

            // - Store token to the localstorage
            localStorage.setItem( 'token', token );
            FileCache.setToken( token );

            // -----------------------------------
            // - NEW SYSTEM, ANCHOR UploaderView
            // - into the document body
            // - Remove this LoginView completely
            // -----------------------------------

            deleteChildren(document.body);
            document.body.appendChild( new UploaderView( token ) );
            this.remove();
            return;
        }
        else throw 'Login failed due to a bad server response';
    }

    displayLoginFail( error )
    {
        this.mNotificationText.textContent = `${error}. Please try again.`;
        this.mEmailInput.value = '';
        this.mPasswordInput.value = '';
    }

    /**
     * Builds and executes the perform_login HTTP Request
     * from Babyfoodworld API
     * 
     * @param {string} email 
     * @param {string} password 
     */
    static async performLogin( email, password )
    {
        if ( email.length > 1 && password.length > 5 )
        {
            const 
            formData = new FormData();
            formData.append( 'email', email );
            formData.append( 'password', password );

            const response = await fetch
            (
                LOGIN_URL,
                {
                    method: 'POST',
                    body: formData
                }
            );
            
            return await response.text();
        }

        return undefined;
    }

    static async checkAuthStatus()
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
 
        const response = await fetch
        (
            AUTH_STATUS_URL,
            {
                method: 'POST',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer,
                },
            }
        );
    
        console.log( `LoginView::checkAuthStatus() status: ${response.status}` );

        return response.status;
    }

    // ----------------------------------------------
    // - Update method section
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("LoginView - connected");

        this.listen( 'logout-signal', e => 
        {
            // ' Send a auth-status Request
            console.log( `LoginView: 'logout-signal' received` );
            
            LoginView
            .checkAuthStatus()
            .then( status => console.log( `Status: ${status}` ) );
        
        });

    }

    disconnectedCallback()
    {
        console.log("LoginView - disconnected");
    }  

}

window.customElements.define( 'login-view', LoginView );

export { LoginView };