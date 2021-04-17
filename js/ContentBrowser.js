import { WCBase, props } from './WCBase.js';

/**
 * 
 */
class ContentBrowser extends WCBase
{
    constructor()
    {
        super();
        
        // -----------------------------------------------
        // - Setup member properties
        // -----------------------------------------------


        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});


        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='browser'>
            <ul class='browser__list'>
            </ul>
            <div class='browser__search'>
              <div class='browser__row'>
                <input class='search__input' type='text'>
                <div class='search__button'></div>
              </div>
            </div>
          </div>`);

        // -----------------------------------------------------
        // - Grab the input and the required asterisk div
        // -----------------------------------------------------

        this.mContentList = this.shadowRoot.querySelector('.browser__list');
        this.m = this.shadowRoot.querySelector('.browser__list');

        const asterisk = this.shadowRoot.querySelector('.component__img--required');

        // -----------------------------------------------------
        // - Add an input event listener, in order to remove the
        // - Red bordered required highlight, when some content
        // - is added into the input
        // -----------------------------------------------------

        this.mInput.addEventListener('input', e => 
        {
            if (this.mInput.value.length)
            {
                if (this.mInput.classList.contains('notify-required'))
                {   
                    this.mInput.classList.remove('notify-required');
                }

                if (asterisk.style.display !== 'none')
                {
                    asterisk.style.display = 'none';
                }
            }
            else
            {
                asterisk.style.display = 'initial';
            }
        });
    }

    /**
     * Returns the text
     * ----------------
     * @return {String}
     */
    get value() 
    {
        return this.mInput.value;
    }

    /**
     * Clears the text input
     * ---------------------
     */
    reset()
    {
        this.mInput.value = '';
    }

    /**
     * Adds a class into the input, which sets a red border,
     * In order to display that the input must be filled
     */
    notifyRequired()
    {
        this.mInput.classList.add('notify-required');
    }
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<text-input-row> connected");
        
    }

    disconnectedCallback()
    {
        console.log("<text-input-row> disconnected");
    }  
}

window.customElements.define('content-browser', ContentBrowser );

export { ContentBrowser };