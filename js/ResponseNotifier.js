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

        const center = window.innerWidth / 2;
        
        /**
         * Minimum width
         */
        let elemW = 300

        if ( window.innerWidth > 1000 )
        {
            /**
             * Max width
             */
            elemW = 900;
        }
        else if ( window.innerWidth <= 1000 && window.innerWidth > 400 )
        {
            /**
             * elem is 100px narrower that the window
             * until it reaches 300px
             */
            elemW = window.innerWidth - 100;
        }

        if ( elemW > window.innerWidth )
        {
            elemW = window.innerWidth - 20;
        }

        const halfWidth = elemW / 2;
        const left = center - halfWidth;
        /**
         * Setup the shadow DOM
         */
        this.attachShadow({mode : 'open'});
        this.setupStyle
        (`.dialog {
            position: absolute;
            top: ${'top' in options ? options.top : '0'};
            left: 0;
            z-index: 1;
            opacity: 0;
            width: ${elemW}px;
            margin: auto;
            padding: 32px;
            background-color: #45d838;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,0.15);
            box-shadow: 2px 4px 12px -3px rgba(0,0,0,0.25);
            transform: translate3d(0, 0, 0);
            transition:
            transform 300ms ease-out,
            opacity 300ms;
        }
        .dialog.visible {
            opacity: 1;
            transform: translate3d(${left}px, 0, 0);
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
            position: relative;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 15px;
            color: #fff
            height: 32px;
            border-radius: 16px;
            border: 4px solid #3888f8;
            background-color: #031128; 
            box-shadow: 
            0 2px 5px -1px rgba(0,0,0,.5),
            inset -12px 0 12px -5px rgba(255, 255, 255, .45),
            inset 7px 0 7px -3px rgba(0, 0, 0, .7);
        }
        .progress-bar__state {
            display: inline;
            color: #fff;
            text-align: center;
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 3px;
            width: 0%;
            height: 24px;
            border-radius: 12px;
            background-color: #b83858;
            box-shadow:
            inset 0 -8px 11px -4px rgba(0, 0, 0, .35),
            inset 0 8px 8px -3px rgba(255, 255, 255, .45);
        }
        .progress-bar__notification {
            position: absolute;
            top: -32px;
            right: 0;
            height: 32px;
            width: 150px;
            text-align: center;
            color: #fff;
            font-weight: 700;
            font-size: 16px;
        }
        .progress-bar__layer {
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            bottom: -3px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .progress-bar__percentage {
            color: #fff;
            font-weight: 700;
            font-size: 16px;
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
                <div class='progress-bar__state'></div>
                <h2 class='progress-bar__notification'></h2>
                <div class='progress-bar__layer'>
                    <p class='progress-bar__percentage'></p>
                </div>
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
        this.mProgressBar           = this.shadowRoot.querySelector('.progress-bar');
        this.mProgressState         = this.shadowRoot.querySelector('.progress-bar__state');
        this.mProgressNotification  = this.shadowRoot.querySelector('.progress-bar__notification');
        this.mProgressPercentage    = this.shadowRoot.querySelector('.progress-bar__percentage');
        this.mHeaderBar             = this.shadowRoot.querySelector('.header-bar');
        this.mMessageBar            = this.shadowRoot.querySelector('.message-bar');
        this.mResponseDto           = this.shadowRoot.querySelector('.response-dto');
        const buttonExit            = this.shadowRoot.querySelector('.button.exit');

        buttonExit.addEventListener( 'click', e => this.remove() );
    }

    /**
     * Initiate response notifier display
     * ------
     * @param {Promise} promise 
     */
    async begin( promise )
    {
        /**
         * Try to fetch the promise,
         * if the fetch / xhr fails in any way,
         * notify the user
         */
        try 
        {
            const { ok, status, text } = await promise;
            console.log(`Notifier: response status ${status} : ok? ${ok}`);

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
        catch ( error )
        {
            /**
             * Extract status and message
             */
            this.doFail(
                
                error.status  ? error.status  : 500,
                error.message ? error.message : 'Request failed'

            );
        }
    }

    /**
     * Display the response status code
     * on top of the progress bar
     * 
     * @param {number} status 
     */
    setStatus( status )
    {
        this.mProgressState.textContent = `status: ${status}`;
    }

    /**
     * Display the predefined success message
     */
    setOkHeader()
    {
        this.mHeaderBar.textContent = this.mMsgOk;
    }

    /**
     * Display the predefined fail message
     */
    setFailHeader()
    {
        this.mHeaderBar.textContent = this.mMsgFail;
    }

    /**
     * Display the Data Transfer Object in the
     * response notifier
     * 
     * @param {object} dto 
     */
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

    /**
     * Display the error message
     * 
     * @param {string} error 
     */
    doError( error )
    {
        this.mMessageBar.innerHTML = error;
    }

    /**
     * Display the faulty message / status code,
     * and execute the fail callback with the provided params
     * 
     * @param {number} status 
     * @param {string} message 
     */
    doFail( status, message )
    {
        this.setStatus( status );
        this.setFailHeader();
        this.mMessageBar.innerHTML = message;
        if ( typeof this.mFailCallback === 'function' ) this.mFailCallback( status, message );
    }

    /**
     * Display the success message,
     * status code and the dto contents.
     * Execute the success callback with the dto
     * 
     * @param {number} status 
     * @param {string} message
     * @param {dto}    dto
     */

    doSuccess( status, message, dto )
    {
        this.setStatus( status );
        this.setOkHeader();
        this.mMessageBar.innerHTML = message;
        this.setDto( dto );
        if ( typeof this.mSuccessCallback === 'function' ) this.mSuccessCallback( dto );
    }

    /**
     * Execute the success callback
     * @param {function} callback 
     */
    onSuccess( callback )
    {
        this.mSuccessCallback = callback;
    }

    /**
     * Execute the fail callback
     * @param {function} callback 
     */
    onFail( callback )
    {
        this.mFailCallback = callback;
    }

    /**
     * Update the progess bar and progress data
     * @param {ProgressEvent} e 
     */
    progressHandler( e )
    {
        const loaded          = e.loaded;
        const total           = e.total; 
        const percentage      = `${Math.round(loaded / total * 100)}%`;
        const formattedLoaded = formatBytes( loaded );
        const formattedTotal  = formatBytes( total );

        console.log( `Uploaded ${formattedLoaded} ( ${percentage} ) of ${formattedTotal} bytes` );

        this.mProgressState.style.width        = percentage;
        this.mProgressNotification.textContent = `${formattedLoaded} / ${formattedTotal}`;
        this.mProgressPercentage.textContent   = percentage;
    }

    /**
     * Execute entry transition when the element
     * is connected to the DOM
     */
    connectedCallback()
    {
        const rootElement   = this.shadowRoot.querySelector( '.dialog' );
        if ( rootElement )
        {
            rootElement.classList.add( 'visible' );
        } 
    }
}

/**
 * Formats an byte amount into a proper power
 * bytes, kb, Mb, Gb
 * 
 * @param  {number} bytes 
 * @return {string} formatted byte value 
 */
function formatBytes( bytes )
{
    let result      = bytes;
    let currentUnit = 'bytes';
    
    if ( typeof bytes === 'number' ) for ( const unit of [ 'kb', 'Mb', 'Gb' ] )
    {
        if ( result / 1024 < 1 ) break;

        result      = result / 1024;
        currentUnit = unit;
    }

    return `${Math.round(result * 10) / 10} ${currentUnit}`;
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