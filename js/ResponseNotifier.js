import { newTagClassChildren, newTagClassHTML } from './util/elemfactory.js';
import { WCBase } from './WCBase.js';

/**
 * Creates a spinning animation, stops when request
 * has arrived and displays it briefly
 * ---------------------------------------------
 * Attributes:
 * - require : boolean
 * 
 */
class ResponseNotifier extends WCBase
{
    constructor
    ( 
        dtoKey, 
        header,
        msgOk   = 'Request succeeded', 
        msgFail = 'Request failed',
        options = {}
    )
    {
        super();
        
        /** Response callback */
        this.mDtoKey    = dtoKey;
        this.mHeader    = header;
        this.mMsgOk     = msgOk;
        this.mMsgFail   = msgFail;

        /**
         * Setup the shadow DOM
         */
        this.attachShadow({mode : 'open'});
        this.setupStyle
        (`.dialog {
            position: absolute;
            top: ${'top' in options ? options.top : '0'};
            left: ${'left' in options ? options.left : '0'};
            right: 0;
            z-index: 1;
            min-width: 300px;
            width: 95vw;
            max-width: 700px;
            margin: auto;
            padding: 32px;
            background-color: #45d838;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,0.15);
            box-shadow: 2px 4px 12px -3px rgba(0,0,0,0.25);
        }
        .progress {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 14px;
            left: 14px;
        }
        .header-row { display: flex; justify-content: center; }
        .header {
            text-transform: uppercase;
            font-weight: 500;
            font-size: 15px;
            color: #fff;
            height: 32px;
        }
        .component__row {
            color: #fff;
            font-size: 12px;
            width: 100%;
            margin: 4px;
            border-radius: 2px;
            border: 1px solid rgba(0,0,0,.33);    
        }
        .progress-bar {
            text-transform: uppercase;
            font-weight: 500;
            font-size: 15px;
            color: #fff
            height: 32px;
            border-radius: 4px;
            border: 1px solid rgba(255,255,255,.33);
            box-shadow: 0 2px 5px -1px rgba(0,0,0,.5);
        }
        .component__row.header-bar {
            height: 120px;
            font-size: 16px;
            text-align: center;
            color: #000;
            padding: 8px;
        }
        .component__row.message-bar {
            overflow-y: scroll;
            min-height: min(200px, 50vh);
        }
        .component__row.response-dto {
            display: flex;
            flex-direction: column;
            height: min(350px,50vh);
            overflow-y: scroll;
            padding: 8px;
        }
        .component__row .entry {
            min-height: 24px;
            display: flex;
        }
        .component__row .entry .key {
            color: #eee;
            text-transform: uppercase;
            margin-right: .7em;
            flex-basis: 120px;
        }
        .component__row .entry .value {
            color: #fff;
            width: 100%;
        }
        .component__row.button-bar {
            display: flex;
            justify-content: flex-end;
            padding-right: 8px;
        }
        .response {
            width: 110px;
            height: auto;
        }`);

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component dialog' data-input-frame>
            <div class='component__row header-row'>
                <p class='header'>Processing ${header} Request</p>
            </div>
            <div class='component__row progress-bar'>
            </div>
            <div class='component__row header-bar'>
            </div>
            <div class='component__row message-bar'>
            </div>
            <div class='component__row response-dto'>
            </div>
            <div class='component__row button-bar'>
                <button class='button exit'>Close</button>
            </div>
          </div>`);

        /**
         * Map the crucial elements into members
         */
        this.mProgressBar = this.shadowRoot.querySelector('.progress-bar');
        this.mHeaderBar   = this.shadowRoot.querySelector('.header-bar');
        this.mMessageBar  = this.shadowRoot.querySelector('.message-bar');
        this.mResponseDto = this.shadowRoot.querySelector('.response-dto');
        const buttonExit  = this.shadowRoot.querySelector('.button.exit');

        buttonExit.addEventListener( 'click', e => this.remove() );
    }

    /**
     * Initiate response notifier display
     * ------
     * @param {Promise} promise 
     */
    async begin( promise )
    {
        const { ok, status, text } = await promise;

        console.log(`addProduct response status ${status} : ok? ${ok}`);

        /**
         * Check whether the response is 403.
         * In that case, send a logout event broadcat
         */
        if ( status == 403 ) this.emit( 'logout-signal' );

        /**
         * When response status is OK, attempt to parse the response body
         */
        if ( ok )
        {    
            const { dto, message } = parseDtoAndMessage( text, this.mDtoKey );
            this.doSuccess( status, message, dto );
        }
        else /** When response status is not okay, display the message if available */ 
        {
            let message = text;
            const body  = parseResponse( text, false );

            if ( body )
            {
                if ( typeof body === 'string' )
                {
                    message = body;
                }
                else 
                if ( 'message' in body )
                {
                    message = body.message;
                }
            }

            this.doFail( status, message );        
        }
    }

    setStatus( status )
    {
        this.mProgressBar.innerHTML = `status: ${status}`;
    }

    setOkHeader()
    {
        this.mHeaderBar.textContent = this.mMsgOk;
    }

    setFailHeader()
    {
        this.mHeaderBar.textContent = this.mMsgFail;
    }

    setDto( dto )
    {
        if ( dto )
        {
            if ( Array.isArray( dto ) )
            {
                /**
                 * Display first the response
                 * array length
                 */
                this.mResponseDto.appendChild
                (
                    newTagClassChildren
                    (
                        'div',
                        'entry',
                        [
                            newTagClassHTML
                            (
                                'h4',
                                'key',
                                `${this.mDtoKey} amount:`
                            ),
                            newTagClassHTML
                            (
                                'p',
                                'value',
                                dto.length
                            )
                        ]
                    )
                );
            
                let index = 0;

                for ( const unit of dto )
                {
                    /**
                     * Display the object index
                     */
                    index++;
                    this.mResponseDto.appendChild
                    (
                        newTagClassChildren
                        (
                            'div',
                            'entry',
                            [
                                newTagClassHTML
                                (
                                    'h4',
                                    'key',
                                    `${this.mDtoKey}`
                                ),
                                newTagClassHTML
                                (
                                    'p',
                                    'value',
                                    index
                                )
                            ]
                        )
                    );

                    for ( const key in unit )
                    {
                        let value = unit[key];
                        let keyString = key;

                        if ( key === 'mediaDto' )
                        {
                            const media = unit.mediaDto;
                            keyString = 'image';

                            if ( unit.mediaDto.image )
                            {
                                value = unit.mediaDto.image.fileName;
                            }
                            else if ( unit.mediaDto.thumbnail )
                            {
                                keyString = 'thumbnail';
                                value = unit.mediaDto.thumbnail.fileName;
                            }
                        }
                        
                        this.mResponseDto.appendChild
                        (
                            newTagClassChildren
                            (
                                'div',
                                'entry',
                                [
                                    newTagClassHTML
                                    (
                                        'h4',
                                        'key',
                                        keyString
                                    ),
                                    newTagClassHTML
                                    (
                                        'p',
                                        'value',
                                        value
                                    )
                                ]
                            )
                        );
                    }
                }
            }
            else for ( const key in dto )
            {
                let value     = dto[ key ];
                let keyString = key;

                if ( key === 'mediaDto' )
                {
                    const media = dto.mediaDto;
                    keyString   = 'image';

                    if ( media.image )
                    {
                        value   = media.image.fileName;
                    }
                    else 
                    if ( media.thumbnail )
                    {
                        keyString = 'thumbnail';
                        value     = media.thumbnail.fileName;
                    }
                }
                    
                this.mResponseDto.appendChild
                (
                    newTagClassChildren
                    (
                        'div',
                        'entry',
                        [
                            newTagClassHTML
                            (
                                'h4',
                                'key',
                                keyString
                            ),
                            newTagClassHTML
                            (
                                'p',
                                'value',
                                value
                            )
                        ]
                    )
                );
            }
        }
    }

    doError( error )
    {
        this.mMessageBar.innerHTML = error;
    }

    doFail( status, message )
    {
        this.setStatus( status );
        this.setFailHeader();
        this.mMessageBar.innerHTML = message;
        if ( typeof this.mFailCallback === 'function' ) this.mFailCallback( status, message );
    }

    doSuccess( status, message, dto )
    {
        this.setStatus( status );
        this.setOkHeader();
        this.mMessageBar.innerHTML = message;
        this.setDto( dto );
        if ( typeof this.mSuccessCallback === 'function' ) this.mSuccessCallback( dto );
    }

    onSuccess( callback )
    {
        this.mSuccessCallback = callback;
    }

    onFail( callback )
    {
        this.mFailCallback = callback;
    }
}

/**
 * Parses the response body to a JSON Object,
 * On success, return the JSON
 * On error, when param 'returnError' is true, return error msg,
 * Otherwise return null
 * 
 * @param  {string}             input
 * @param  {boolean}            returnError
 * @return {object|string|null} 
 */
function parseResponse( input, returnError = true )
{
    let body = null;

    try 
    {
        body = JSON.parse( input );
    }
    catch ( error )
    {
        if ( returnError ) return error;
    }

    return body;
}

/**
 * Parse the input string and try to parse
 * an message string and a dto, by the use of
 * param 'dtoKey' from the parsed JSON
 * 
 * @param  {string}          input 
 * @param  {string}          dtoKey
 * @return {{string,object}} 
 */
function parseDtoAndMessage( input, dtoKey )
{
    let   message = '';
    let   dto     = null;
    const body    = parseResponse( input, false );

    if ( ! body )
    {
        message = input;
    }
    else 
    if ( Array.isArray( body ) )
    {
        dto = body;
    }
    else
    {
        if ( 'message' in body ) message = body.message;
        if ( body.hasOwnProperty( dtoKey ) ) dto = body[ dtoKey ];
    }

    return { dto, message }
}

window.customElements.define( 'response-notifier', ResponseNotifier );

export { ResponseNotifier, parseResponse, parseDtoAndMessage };