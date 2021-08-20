import { WCBase } from '../WCBase.js';

/**
 * This is an singluar entry element
 * used in the ProductStore
 * 
 * @emits
 */
class ProductEntry extends WCBase
{
    constructor( product = {} )
    {
        super();

        let id = undefined;

        /**
         * Check for id/systemProductId
         */
        if ( 'id' in product )
        {
            id = product.id;
        }

        if ( 'systemProductId'  in product && product.systemProductId )
        {
            id = product.systemProductId;
        }

        this.mFail = false;

        if ( 
            ! 'name'            in product ||
            ! 'productCategory' in product ||
            ! id 
        )
        {
            console.log(`ProductEntry::FAIL!`);
            this.mFail = true;
            //this.remove();
            //return;
        }

        /**
         * Required
         */
        this.mName            = product.name;
        this.mProductCategory = product.productCategory;
        this.mSystemProductId = id;

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow( { mode: 'open' } );
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
            <div class='entry'>
                <h2 class='entry__name'>${this.mName}</h2>
                <input type='number' class='entry__amount'>
                <div class='select__toggler unit' tabindex='0'>
                    <p class='unit__title'>liter</p>
                    <div class='unit__frame'>
                       <div class='unit__item active'>ml</div>
                       <div class='unit__item'>liter</div>
                       <div class='unit__item'>gr</div>
                       <div class='unit__item'>pieces</div>
                       <div class='unit__item'>cup</div>
                       <div class='unit__item'>cups</div>
                       <div class='unit__item'>tsp</div>
                       <div class='unit__item'>tbsp</div>
                       <div class='unit__item'>clove</div>
                       <div class='unit__item'>can</div>
                       <div class='unit__item'>cans</div>
                       <div class='unit__item'>slice</div>
                       <div class='unit__item'>slices</div>
                       <div class='unit__item'>a pinch of</div>
                       <div class='unit__item'>none</div>
                    </div>
                </div>
                <button class='action remove'></button>
            </div>
        `);
        
        this.setupStyle
         (`
        .entry { 
            display: flex;
            align-items: center;
            position: relative;
            width: 100%; 
            height: 48px;
            padding: 12px 6px;
            background-color: #fff;
            border-top: 1px solid rgba(0,0,0,0.25);
            box-shadow: inset 0 -12px 18px -6px rgba(0,0,40,.25);
        }
        .entry__name { 
            max-width: 380px;
            width: 50%;
            min-width: 80px;  
            font-size: 14px; 
        }
        .entry__amount { 
            margin-right: 4px;
            padding-left: 8px;
            width: 64px;
            height: 30px;
            border: 1px solid rgba(0,0,0,.15);
            box-shadow: inset 0 4px 4px -3px rgba(20,0,60,.25);
        }
        .entry__amount:active,
        .entry__amount:focus,
        .entry__amount:focus-visible { 
            outline: none;
            border: 2px solid #555;
        }
        .select__toggler {
            cursor: pointer;
            position: relative;
            width: 64px;
            height: 30px;
            margin-right: 20px;
            padding: 5px;
            background-color: #fff;
            border-radius: 6px;
            border: 1px solid #0000003f;
            background-repeat: no-repeat;
            background-position-x: right;
            box-shadow: inset 0 -5px 10px 0 rgba(128,0,72,.25);
        }
        .select__toggler[tabindex='-1'],
        .select__toggler:disabled {
           opacity: .5;
        }
        .select__toggler .unit__frame {
            top: -100px;
            left: 0;
            display: none; 
            position: absolute;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #0000003f;
            z-index: 10;
        }
        .select__toggler .unit__frame.visible {
            display: block;
        }
        .select__toggler .unit__item {
           cursor: pointer;
           min-width: 80px;
           height: 24px;
           padding: 4px;
        }
        .select__toggler .unit__item.active {
           color: #fff;
           background-color: #656565;
        }
         .action {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 12px;
            width: 32px;
            height: 32px;
            padding: 2px;
            margin-left: 4px;
            background-repeat: no-repeat;
            background-size: cover;
            border: 3px solid rgba(255,80,80,0.7);
            box-shadow: -4px 4px 4px -2 rgba(40,40,128,0.5);
            transition: border-color .3s;
         }
        .action:hover {
            border-color: rgba(0,0,0,.25);
        }
        .action:focus {
            border-color: rgba(255,80,80,0.5);
            outline: none;
        }
        .action:active {
            outline: none;
            border-color: rgba(0, 0, 0, 0.5);
        }
        .action.edit {
            background-image: url('assets/icon_edit.svg');
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
        }`);


    
        /**
         * If these are set, the product is about to be edited
         */
        this.mAmount          = product.amount;
        this.mMeasureUnit     = product.measureUnit
        
        this.mProductReference = product;
                       
        /**
         * Get the allergen data
         */

        this.mHasAllergens = false;
        this.mHasEggs      = false;
        this.mHasNuts      = false;
        this.mHasGluten    = false;
        this.mHasLactose   = false;

        if ( 'hasAllerges' in product )
        {
            this.mHasAllergens = product.hasAllergens;
        }

        if ( 'hasEggs' in product )
        {
            this.mHasEggs = product.hasEggs;
        }

        if ( 'hasNuts' in product )
        {
            this.mHasNuts = product.hasNuts;
        }

        if ( 'hasGluten' in product )
        {
            this.mHasGluten = product.hasGluten;
        }

        if ( 'hasLactose' in product )
        {
            this.mHasLactose = product.hasLactose;
        }
        
        this.mAmountInput   = this.shadowRoot.querySelector( '.entry__amount' );
        this.mUnitInput     = this.shadowRoot.querySelector( '.select__toggler' );
        this.mUnitTitle     = this.shadowRoot.querySelector( '.unit__title' );
        this.mUnitFrame     = this.shadowRoot.querySelector( '.unit__frame' );
    
        const unitList = [
            'ml',
            'liter',
            'gr',
            'pieces',
            'cup',
            'cups',
            'tsp',
            'tbsp',
            'clove',
            'can',
            'cans',
            'slice',
            'slices',
            'a pinch of',
            'none'
        ];

        this.mUnitIndex = 0;
        const unitFrame = this.mUnitFrame;
        let unitAmount  = unitList.length;
        let unitFocus   = false;
    
        /*const productAttributes = () =>
        {
            return {
                name:   this.mName,
                amount: this.mAmountInput.value,
                unit:   this.mUnitTitle.textContent.replaceAll(' ', '_').toUpperCase()
            };
        };*/

        const setActiveUnit = () =>
        {
            let index = 0;
            for ( const elem of unitFrame.children )
            {
                const clist = elem.classList;
                index === this.mUnitIndex ? clist.add( 'active' ) : clist.remove( 'active' ); 
                index++;
            }
        };

        // - Add click listeners and logic into the unit elements

        for ( const elem of unitFrame.children )
        {
            elem.addEventListener( 'click', e =>
            {
                const text = e.target.textContent;
                let elemIndex = 0;
                for ( const unit of unitList )
                {
                    if ( text === unit )
                    {
                        this.mUnitIndex = elemIndex;
                        setActiveUnit();
                        this.mUnitTitle.textContent = text;
                        unitFrame.classList.remove( 'visible' );
                        e.stopPropagation();
                        break;
                    }

                    elemIndex++;
                }
            });
        }

        // - Observe the unit input with click and enter - //
        this.mUnitInput.addEventListener( 'focus', e => 
        {
            unitFocus = true;
        });

        this.mUnitInput.addEventListener( 'blur', e => 
        {
            unitFocus = false;
            unitFrame.classList.remove( 'visible' );
        });

        this.mUnitInput.addEventListener( 'click', e => 
        {
            unitFrame.classList.toggle( 'visible' );
        });
    
        this.shadowRoot.addEventListener( 'keydown', e => 
        {
            const visible = unitFrame.classList.contains('visible');

            /**
             * Unit input is in focus
             */
            if ( unitFocus )
            {
                if ( visible )
                {
                    switch( e.keyCode )
                    {
                        case this.ENTER:
                        {
                            e.preventDefault();
                            this.mUnitTitle.textContent = unitList[ this.mUnitIndex ];
                            unitFrame.classList.remove( 'visible' );
                            break;
                        }
                        case this.KEYUP:
                        {
                            e.preventDefault();
                            e.stopPropagation();
                            this.mUnitIndex > 0 
                                ? this.mUnitIndex-- 
                                : this.mUnitIndex = unitAmount - 1;

                            setActiveUnit();
                            break;
                        }
                        case this.KEYDOWN:
                        {
                            e.preventDefault();
                            e.stopPropagation();
                            this.mUnitIndex < unitAmount - 1
                                ? this.mUnitIndex++
                                : this.mUnitIndex = 0;
                        
                            setActiveUnit();
                            break;
                        }
                    }
                }
                else if ( e.keyCode === this.ENTER )
                {
                    unitFrame.classList.add( 'visible' );
                }
            }    
        });

    
        const removeButton  = this.shadowRoot.querySelector( '.action.remove' );
        removeButton.addEventListener( 'click', e => this.remove() );

        this.shadowRoot.dispatchEvent
        (
            new CustomEvent('allergens-added', 
            {
                bubbles: true,
                composed: true,
                detail: 
                {
                    'product': this.mCurrentProduct
                }
            })
        );
         
    }

    /**
     * Return the image and the text content
     * 
     * @return {object}
     */
    get value()
    {
        const amount = this.mAmountInput.value;

        //if ( ! amount.length || ! amount ) return undefined;

        const attributes = {

            name:               this.mName, 
            productCategory:    this.mProductCategory, 
            systemProductId:    this.mSystemProductId,
            amount:             this.mAmountInput.value,
            measureUnit:        this.mUnitTitle.textContent.replaceAll(' ', '_').toUpperCase(),
            userId:             1


        };

        const allergens = this.allergens;
        for ( const key in allergens )
        {
            attributes[ key ] = allergens[ key ];
        }

        return attributes;
    }

    /**
     * Returns the allergen truth map
     */
    get allergens()
    {
        return {

            hasAllergens: this.mHasAllergens,
            hasNuts:      this.mHasNuts,
            hasEggs:      this.mHasEggs,
            hasGluten:    this.mHasGluten,
            hasLactose:   this.mHasLactose

        };
    }

    get fail()
    {
        return this.mFail;
    }

    setMeasureUnit( unit )
    {
        const unitList = [
            'ml',
            'liter',
            'gr',
            'pieces',
            'cup',
            'cups',
            'tsp',
            'tbsp',
            'clove',
            'can',
            'cans',
            'slice',
            'slices',
            'a pinch of',
            'none'
        ];

        for ( const unitItem of unitList )
        {
            if ( unit === unitItem )
            {
                let index = 0;

                for ( const elem of this.mUnitFrame.children )
                {
                    const text = elem.textContent.toLowerCase();
                    const clist = elem.classList;
                    if ( text === unit )
                    {
                         clist.add( 'active' );
                         this.mUnitIndex = index;
                         this.mUnitTitle.textContent = unit;
                    }
                    else clist.remove( 'active' ); 
                    index++;
                }
            }
        }
    }
    
    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<product-entry> connected");
        this.emit( 'product-entry-added' );

        if ( this.mAmount ) this.mAmountInput.value = this.mAmount;
        if ( this.mMeasureUnit ) this.setMeasureUnit( this.mMeasureUnit );
    }

    disconnectedCallback()
    {
        console.log("<product-entry> disconnected");
        this.emit( 'product-entry-removed' );
    }
}
 

window.customElements.define( 'product-entry', ProductEntry );

export { ProductEntry };