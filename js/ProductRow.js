import { WCBase } from './WCBase.js';
import { newTagClass, newTagClassHTML, newTagClassChildren, deleteChildren } from './util/elemfactory.js';

/**
 * Row with ingredient value set,
 * 1) Name
 * 2) Amount
 * 3) Unit
 * +) Add button
 * ======================================== 
 */
class ProductRow extends WCBase
{
    constructor(name)
    {
        super();

        this.mKey  = 'products';
        this.mName = name ? name : 'Placeholder';
        this.mProductMap = {};
        /**
         * @property currentProduct
         * ---------
         * a plaeholder for product object
         */
        this.mCurrentProduct = undefined;

        // -----------------------------------------------
        // - Setup ShadowDOM and possible local styles
        // -----------------------------------------------

        this.attachShadow({mode : "open"});
  
        this.setupTemplate
        (`<link rel='stylesheet' href='assets/css/components.css'>
          <div class='component'>
            <div class='component__row'>
                <p class='component__label required'>Ingredient list</p>
            </div>
            <div class='component__row'>
                <p class='component__label name'></p>
                <input class='component__input type--number amount' type='number'>
                <div class='select__toggler unit' tabindex='0'>
                    <p class='title'>liter</p>
                    <div class='frame'>
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
                <button class='action add'></button>
            </div>
            <div class='store'>
            </div>
         </div>`);
        
        this.setupStyle
         (`
         .component {
             border: 1px solid transparent;
         }
         .component__row { justify-content: space-between; }
         .component__label {
            padding: 4px;
            background-color: #ffffff;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 8px;
            flex-basis: 40%;
         }
         .component__label.required {
            background-color: transparent;
            border: none;
            position: absolute;
            transform: translate3d(0, -1.6em, 0);
         }
         .component__input {
             flex-basis: 20%
         }
         .select__toggler {
             position: relative;
             width: 64px;
             height: auto;
             padding: 5px;
             background-color: #fff;
             border-radius: 2px;
             border: 1px solid #0000003f;
             background-repeat: no-repeat;
             background-position-x: right;
         }
         .select__toggler[tabindex='-1'],
         .select__toggler:disabled {
            opacity: .5;
         }
         .select__toggler .frame {
             top: -100px;
             left: 0;
             display: none; 
             position: absolute;
             background-color: #fff;
             border-radius: 4px;
             border: 1px solid #0000003f;
             z-index: 10;
         }
         .select__toggler .frame.visible {
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
         .store .component__row {
             justify-content: space-between;
         }
         .store__field {
            color: #444;
            padding: 4px;
            background-color: #ffffff;
            border: 1px solid rgba(0,0,0,0.25);
            border-radius: 8px;
            margin: 0 4px 2px 0;
         }
         .store__field.name {
            flex-basis: 40%;
         }
         .store__field.category {
             width: 0;
         }
         .store__field.amount {
            flex-basis: 20%;
         }
         .store__field.unit {
            width: 64px;
         }
         .action {
            cursor: pointer;
            width: 30px;
            height: 30px;
            border: 1px solid transparent;
            border-radius: 16px;
            background-color: transparent;
            background-repeat: no-repeat;
            background-position-x: -1px;
            background-size: cover;
        }
        .action:focus,
        .action:active {
            outline: none;
            background-color: #ffffffc0;
            border: 1px solid rgba(50, 0, 88, 0.53);
            box-shadow: 0 0 12px 0px rgba(0, 0, 40, 0.35);
        }
        .action.add {
            background-image: url('assets/icon_plus.svg');
        }
        .action.remove {
            background-image: url('assets/icon_delete_perm.svg');
        }`);

        this.mFrame         = this.shadowRoot.querySelector('.component');
        this.mAsteriskLabel = this.shadowRoot.querySelector('.component__label.required');
        this.mNameLabel     = this.shadowRoot.querySelector('.name');
        this.mAmountInput   = this.shadowRoot.querySelector('.amount');
        this.mUnitInput     = this.shadowRoot.querySelector('.unit');
        this.mUnitTitle     = this.shadowRoot.querySelector('.unit .title');
        this.mUnitFrame     = this.shadowRoot.querySelector('.frame');
        this.mStore         = this.shadowRoot.querySelector('.store'); 
      
        const unitFrame = this.mUnitFrame;
        const addButton = this.shadowRoot.querySelector('.action.add');
        
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
        let unitAmount = unitList.length;
        let unitFocus = false;
        let addFocus  = false;

        const productAttributes = () =>
        {
            return {
                name:   this.mNameLabel.textContent,
                amount: this.mAmountInput.value,
                unit:   this.mUnitTitle.textContent.replaceAll(' ', '_').toUpperCase()
            };
        };

        const setActiveUnit = () =>
        {
            let index = 0;
            for (const elem of unitFrame.children)
            {
                const clist = elem.classList;
                index === this.mUnitIndex ? clist.add('active') : clist.remove('active'); 
                index++;
            }
        };

        // - Add click listeners and logic into the unit elements

        for (const elem of unitFrame.children)
        {
            elem.addEventListener('click', e =>
            {
                const text = e.target.textContent;
                let elemIndex = 0;
                for (const unit of unitList)
                {
                    if (text === unit)
                    {
                        this.mUnitIndex = elemIndex;
                        setActiveUnit();
                        this.mUnitTitle.textContent = text;
                        unitFrame.classList.remove('visible');
                        e.stopPropagation();
                        break;
                    }
                    elemIndex++;
                }
            });
        }

        // - Observe the unit input with click and enter - //
        this.mUnitInput.addEventListener('focus', e => 
        {
            unitFocus = true;
        });

        this.mUnitInput.addEventListener('blur', e => 
        {
            unitFocus = false;
            unitFrame.classList.remove('visible');
        });

        this.mUnitInput.addEventListener('click', e => 
        {
            unitFrame.classList.toggle('visible');
        });

        /**
         * Add button event listeners
         */
        addButton.addEventListener('focus', e =>
        {
            addFocus = true;
        });

        addButton.addEventListener('blur', e =>
        {
            addFocus = false;
        });
        
        addButton.addEventListener('click', e => 
        {
            this.addField(productAttributes());
        });
         
        this.shadowRoot.addEventListener('keydown', e => 
        {
            const visible = unitFrame.classList.contains('visible');

            /**
             * Unit input is in focus
             */
            if (unitFocus)
            {
                if (visible)
                {
                    switch(e.keyCode)
                    {
                        case this.ENTER:
                        {
                            e.preventDefault();
                            this.mUnitTitle.textContent = unitList[this.mUnitIndex];
                            unitFrame.classList.remove('visible');
                            break;
                        }
                        case this.KEYUP:
                        {
                            e.preventDefault();
                            e.stopPropagation();
                            this.mUnitIndex > 0 
                                    ? this.mUnitIndex-- 
                                    : this.mUnitIndex = unitAmount - 1;

                            /*this.mUnitIndex--;
                            if (this.mUnitIndex < 0)
                            {
                                this.mUnitIndex = unitAmount - 1;
                            }*/
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
                            /*        
                            if (this.mUnitIndex >= unitAmount)
                            {
                                this.mUnitIndex = 0;
                            }*/
                            setActiveUnit();
                            break;
                        }
                    }
                }
                else if (e.keyCode === this.ENTER)
                {
                    unitFrame.classList.add('visible');
                }
            }
            else if (addFocus && e.keyCode === this.ENTER)
            {
                this.addField(productAttributes());
            }
        });

    }

    // ----------------------------------------------
    // - Methods
    // ----------------------------------------------


    get fields()
    {
        const result = [];

        for (const row of this.mStore.children)
        {
            const name            = row.querySelector('.name').textContent;
            const amount          = row.querySelector('.amount').textContent;
            const measureUnit     = row.querySelector('.unit').textContent.toUpperCase();
            const productCategory = row.dataset.category;
            const userId = 1;
            result.push({name, productCategory, amount, measureUnit, userId});
        }

        return result;
    }

    /**
     * Returns value of the input if set, or undefined
     * -------
     * @return {array|undefined}
     */
    get value()
    {
        const  result = this.fields;

        return result.length ? result : undefined;
    }

    get count()
    {
        return this.mStore.children.length;
    }

    object()
    {
        const  result = this.value;

        return result ? {[this.mKey]: result} : result;
    }

    /**
     * Return required status
     * ---------------
     * @return {boolean}
     */
    get required()
    {
        return true;
    }

    /**
     * Adds a new product line under the store
     * ---------------------
     * @param {object} product 
     */
    addField(product)
    {
        const name     = product.name;
        const amount   = product.amount;
        const unit     = product.unit;
        const category = this.mCurrentProduct.productCategory;

        /**
         * Validation guard
         */
        if ( ! name.length || amount <= 0.0 || ! unit.length ) return;

        const nameField     = newTagClassHTML('p', 'store__field name',   name);
        const amountField   = newTagClassHTML('p', 'store__field amount', amount);
        const unitField     = newTagClassHTML('p', 'store__field unit',   unit);
        const button        = newTagClass('button', 'action remove');

        const row = newTagClassChildren
        ('div', 
         'component__row', 
            [ 
                nameField,
                amountField,
                unitField, 
                button 
            ]
        );
        
        /**
         * Add product category data into the row
         */
        row.setAttribute('data-category', category);

        /**
         * Create a remove button click listener
         */
        button.addEventListener('click', e =>
        {
            row.remove();
            this.checkAsterisk();
        });

        this.mStore.appendChild( row );
        this.clear();
        this.mFrame.classList.remove('notify-required');

        // ----------------------------------------
        // - Send the allergens for the recipe view
        // ----------------------------------------

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


        //this.emit('allergens-added', this.mCurrentProduct );
    }

    reset()
    {
        deleteChildren( this.mStore );
        this.clear();
    }
    
    applyConnection( product )
    {
        const key = 'name';

        if ( ! product.hasOwnProperty(key))
        {
            console.log(`ProductRow::applyConnection() product ${product} has no key`);
            return;
        }

        this.mAmountInput.disabled = false;
        this.mUnitInput.setAttribute('tabindex', '0');
        this.mNameLabel.textContent = product.name;
        this.mUnitTitle.textContent = 'liter';

        this.mCurrentProduct = product;
    }

    /**
     * Clears all inputs and defocuses the element
     */
    clear()
    {
        this.mNameLabel.textContent = '';
        this.mAmountInput.value = '';
        this.mAmountInput.disabled = true;
        this.mUnitTitle.textContent = '';
        this.mUnitInput.setAttribute('tabindex', '-1');
        this.mUnitIndex = 0;
        let index = 0;

        for (const elem of this.mUnitFrame.children)
        {
            const clist = elem.classList;
            ! index ? clist.add('active') : clist.remove('active');
            index++;
        }

        this.checkAsterisk();
    }

    /**
     * Ensures that the asterisk of requirement
     * is properly set
     */
    checkAsterisk()
    {
        const clist = this.mAsteriskLabel.classList;
        this.count ? clist.add('off') : clist.remove('off');
    }

    /**
     * Adds a class into the image area element, to display
     * a red border -- when ensure is set,
     * the notification fires only when the input is not set
     * ------
     * @param {boolean} ensure
     */
    notifyRequired(ensure = true)
    {
        if ( ! ensure || ! this.value ) this.mFrame.classList.add('notify-required');
    }

    // ----------------------------------------------
    // - Lifecycle callbacks
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("<product-row> connected");

        this.clear();
        /**
         * Listen for product-select
         */
        this.shadowRoot.addEventListener('product-select', e =>
        {
            e.stopPropagation();

            const titleKey = 'name';

            const obj = e.detail;
            const title = obj[titleKey];

            console.log(`ProductRow: product-select event catched, details: ${title}m emit allergens`);

            // - Emit allergens

        }, true);
    }

    disconnectedCallback()
    {
        console.log("<product-row> disconnected");
    }
}
 

window.customElements.define('product-row', ProductRow );

export { ProductRow };