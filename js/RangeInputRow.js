import { InputBase } from './InputBase.js';

/**
 * RangeInputRow
 * ------------
 * This WebComponent is a range+number input,
 * with a title on the top, and a paragraph
 * at the right - a unit may be displayed there
 * When 'required' attribute is set, and the input
 * is empty/zero, the element
 * will display an red asterisk at the right hand
 * of the title
 * --------------------------------------------
 * Attributes:
 * - require : boolean
 * - unit    : string
 */
class RangeInputRow extends InputBase
{
    constructor()
    {
        super({type: 'number'});
        
        this.mMin   = this.hasAttribute('data-min') ? Number(this.dataset.min) : undefined;

        const unit  = this.hasAttribute('data-unit') ? this.dataset.unit           : '';
        const min   = this.mMin                      ? `min='${this.dataset.min}'` : '';
        const max   = this.hasAttribute('data-max')  ? `max='${this.dataset.max}'` : '';
        const value = this.dataset.value;
        
        // -----------------------------------------------
        // - Setup ShadowDOM: set stylesheet and content
        // - from template 
        // -----------------------------------------------

        this.attachShadow({mode : "open"});

        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
        <div class='component'>
            <div class='component__row'>
                <p class='component__label'><slot></p>
            </div>
            <div class='component__row'> 
                <input type='range'  class='component__range' ${min} ${max}>
                <input type='number' class='component__input type--number' ${min} ${max}>
                <p class='component__unit'>${unit}</p>
            </div>
        </div>`);

        // ---------------------------
        // - Grab the Title label and 
        // - the number input elements
        // ---------------------------

        const range = this.shadowRoot.querySelector('.component__range');
        const input = this.shadowRoot.querySelector('.component__input');
        const label = this.shadowRoot.querySelector('.component__label');

        this.initNotifier(input);
        this.initInputAndLabel(input, label);

        function handleInput(e)
        {
            if ( e.target.type === 'number' )
            {
                range.value = e.target.value;
            }
            else if ( e.target.type === 'range' )
            {
                input.value = e.target.value;
            }

            this.emit( 'recipe-row-height', `${e.target.value}px` );
        }

        if ( value )
        {
            const numericValue = Number( value );
            input.value = numericValue;
            range.value = numericValue;
        }
        
        input.addEventListener( 'input', e => handleInput(e) );
        range.addEventListener( 'input', e => handleInput(e) );
    }

    /**
     * Clear the input
     */
     reset()
     {
         this.mInput.value = this.mMin ? this.mMin : 0;
         this.mRange.value = this.mMin ? this.mMin : 0;
         if (this.required) this.mLabel.classList.add('required');
     }
}

window.customElements.define('range-input-row', RangeInputRow );

export { RangeInputRow };