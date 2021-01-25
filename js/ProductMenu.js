import { WCBase, props, MEASURE_UNIT_ENUM } from './WCBase.js';
import 
{ 
    newTagClass,
    newTagClassAttrs,
    newTagClassChildren, 
    newTagClassHTML, 
    deleteChildren, 
    setSelectedIndex, 
    inputClassValue, 
    numberInputClass,
    numberInputClassValue,
    fileInputClass,
    selectClassIdOptionList,
    setImageFileInputThumbnail
} from './util/elemfactory.js';

const 
template = document.createElement("template");
template.innerHTML =
`<div class='productmenu'>
   <div class='editor__rowset'>
     <label  class='editor__label'>Add New product</label>
     <select class='editor__select available_products' name='recipe_ingredients'>
     </select>
   </div>
   <div  class='editor__frame new_product'>
   </div>

    <!-- Edit existing products -->
    <label  class='editor__label--select'>Edit existing products:</label>
   <div class='editor__frame utilized_products'>
   </div>

</div>`;

/**
 * -------------------------------------
 * Menu that display associaded products
 * -------------------------------------
 * Used on RecipeView and RecipeEditor
 */
class ProductMenu extends WCBase
{
    constructor()
    {
        super();

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
        .editor__frame {
            display: flex;
            flex-direction: column;
            margin: 16px auto;
            max-width: 600px;
        }
        .editor__rowset {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 48px;
            padding: 8px;
            border-bottom: 1px solid ${props.lightgrey};
        }
        .editor__label {
            font-size: ${props.text_font_size};
            font-weight: 200;
            color: #222;
            height: ${props.lineHeight};
        }
        .editor__input {
            padding: 4px;
            color: #222;
            font-size: ${props.small_font_size};
            font-weight: 300;
            background-color: transparent;
            outline: none;
            border-bottom: 2px solid ${props.grey};
            height: ${props.lineHeight};
        }
        .editor__button {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.green};
            background-image: url('assets/icon_update.svg');
        }
        .editor__button--new {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.blue};
            background-image: url('assets/icon_add_circle.svg');
        }
        .editor__button--save {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_save.svg');
        }
        .editor__button--delete {
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 2px solid ${props.darkgrey};
            color: #fff;
            background-color: ${props.red};
            background-image: url('assets/icon_cancel.svg');
        }
        .editor__image {
            width: 32px;
            height: 32px;
        }
        .ingredient__frame
        {
            display: flex;
            flex-direction: column;
            padding: 4px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            border-bottom: 1px solid ${props.green};
        }
        .ingredient__row
        {
            padding: 4px;
            display: flex;
            flex-direction: row;
            height: 32px;
        }
        .ingredient__title
        {
            flex-basis: 60%;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: ${props.ingredient_height};
            margin-left: 8px;
        }
        .ingredient__amount
        {
            background: transparent;
            outline: none;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 2px solid ${props.darkgrey};
            max-width: 50px;
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            margin-left: 8px;
            height: ${props.ingredient_height};
        }
        .ingredient__unit
        {
            background: transparent;
            outline: none;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 2px solid ${props.darkgrey};
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            height: ${props.ingredient_height};
        }
        .ingredient__category
        {
            color: #222;
            font-size: ${props.small_font_size};
            text-shadow: 0 2px 10px ${props.blue};
            min-height: 32px;
            padding: 8px;
        } 
        .ingredient__button--remove
        {
            margin-left: 4px;
            margin-top: 2px;
            width: 16px;
            height: 16px;
            background-image: url('assets/icon_cancel');
            background-repeat: no-repeat;
        }
        `);

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.mIsEditorOpen = false;

        // ---------------------------
        // - Save element references
        // ---------------------------

        this.mProductsAvailable = this.shadowRoot.querySelector('.editor__select.available_products');
        this.mNewProductEntry = this.shadowRoot.querySelector('.editor__frame.new_product');
        this.mProductList = this.shadowRoot.querySelector('.editor__frame.utilized_products');

        const products = 
        [
            {
                id: 1,
                name: "Potato",
                amount: 200,
                measureUnit: "GR",
                productCategory: "VEGETABLES",
                systemProductId: 2
            },
            {
                id: 2,
                name: "Ground beef 10%",
                amount: 400,
                measureUnit: "GR",
                productCategory: "MEAT",
                systemProductId: 10
            },
            {
                id: 3,
                name: "Tomato",
                amount: 2,
                measureUnit: "SLICES",
                productCategory: "VEGETABLES",
                systemProductId: 3
            }
        ];

        //this.setupProductList(products);
        //this.setupAvailableProducts(products);
        
    }

    /**
     * Generates the list of already utilized products
     * -----------------------------------------------
     * 
     * @param {array} products 
     */
    setupProductList(products)
    {
        deleteChildren(this.mProductList);

        for (const product of products)
        {
            this.addProductRow(product);
        }
    }

    addProductRow(product)
    {
        const uploaderItem = newTagClassAttrs("div", "ingredient__frame", {"data-id":product.id});

        // ---------------------------------------
        // - Amount input and measureUnitSelection
        // ---------------------------------------

        const amountInput = numberInputClassValue("ingredient__amount", product.amount);
        const measureUnitSelect = selectClassIdOptionList("ingredient__unit", "", MEASURE_UNIT_ENUM);

        setSelectedIndex(measureUnitSelect, product.measureUnit);

        // ----------------------------------------
        // - Update and Delete buttons
        // ----------------------------------------

        const 
        updateButton = newTagClass("button", "editor__button");
        updateButton.addEventListener("click", e => { console.log(`Edit this: ${product.id}`) });

        const 
        deleteButton = newTagClass("button", "editor__button--delete");
        deleteButton.addEventListener("click", e => { console.log(`Delete this: ${product.id}`) });

        // ----------------------------------------
        // - Setup the row with all the fields
        // ----------------------------------------

        uploaderItem.appendChild
        (
            newTagClassChildren
            (
                "div",
                "ingredient__row",
                [
                    newTagClassHTML("div", "ingredient__title", product.name),
                    amountInput,
                    measureUnitSelect,
                    updateButton,
                    deleteButton
                ]
            ) 
        );

        // ---------------------------------------
        // - And ad the category to the second row
        // ---------------------------------------

        uploaderItem.appendChild(newTagClassHTML("div", "ingredient__category", product.productCategory));

        // ---------------------------------------
        // - Finally set the product rowset to
        // - The list
        // ---------------------------------------

        this.mProductList.appendChild( uploaderItem );
    }

    /**
     * Populates the product select drop down
     * And generates the addition logic
     * 
     * @param {*} products 
     */
    setupAvailableProducts(products)
    {
        console.log(`Available product amt: ${products.length}`);

        for (const product of products)
        {

            console.log(`Product: ${product.name}`);
            const option = newTagClassAttrs
            (
                "option", 
                "editor__option", 
                {"data-id":product.id}, 
                product.name
            );
            option.value = product.id;

            this.mProductsAvailable.appendChild( option );
        }

        this.mProductsAvailable.addEventListener
        (
            "change",
            e =>
            {
                const value = e.target.value;

                // --------------------------------------
                // - Go through the objects, find out if
                // - The the product is chosen
                // --------------------------------------

                console.log(`Ingredients list children: ${this.mProductList.children.length}`);

                for (const elem of this.mProductList.children)
                {
                    if (elem.getAttribute('data-id') === value)
                    {
                        console.log(`The object is already chosen`);
                        return;
                    }
                }

                let product = null;

                for (const p of products)
                {
                    console.log(`product: ${p} - ${value}`);
                    if (Number(p.id) === Number(value))
                    {
                        product = p;
                        break;
                    }
                }

                if (! product)
                {
                    console.log(`The chosen product wasn't in the product object list`);
                    return;
                }

                // --------------------------------------------------------------------
                // - Setup this to the NEW PRODUCT row, since we are in the EDITOR MODE,
                // - And not creating a new recipe form scratch
                // ---------------------------------------------------------------------

                deleteChildren(this.mNewProductEntry);

                const
                uploaderItem = newTagClassAttrs("div", "ingredient__frame", {"data-id":value});

                const 
                removeButton = newTagClass("div", "ingredient__button--remove");
                removeButton.addEventListener
                (
                    "click",
                    inner =>
                    {
                        uploaderItem.remove();
                    }  
                );

                const 
                saveButton = newTagClass("button", "editor__button--save");
                saveButton.addEventListener("click", inner => { this.addProduct(product)});

                uploaderItem.appendChild
                (
                    newTagClassChildren
                    (
                        "div",
                        "ingredient__row",
                        [
                            removeButton,
                            newTagClassHTML("div", "ingredient__title", product.name),
                            numberInputClass("ingredient__amount"),
                            selectClassIdOptionList("ingredient__unit", "", MEASURE_UNIT_ENUM)
                        ]
                    ) 
                );
                uploaderItem.appendChild
                (
                    newTagClassChildren
                    (
                        "div",
                        "editor__rowset",
                        [
                            newTagClassHTML("div", "ingredient__category", product.productCategory),
                            saveButton
                        ]
                    )

                );

                this.mNewProductEntry.appendChild( uploaderItem );
            }
        );
    }

    /**
     * Uploads the step and closes the editor
     * @param {*} step 
     */
    addProduct(product)
    {
        console.log(`Add step: ${product.name}, ${product.id}`);
        deleteChildren(this.mNewProductEntry);
    }


    // ----------------------------------------------
    // - Update method section
    // ----------------------------------------------

    connectedCallback()
    {
        console.log("ProductMenu::callback connected");
        //this.dispatchEvent(new CustomEvent("productmenuconnected"));
        window.dispatchEvent(new CustomEvent("productmenuconnected"));
    }

    disconnectedCallback()
    {
        console.log("ProductMenu::callback connected");
    }  

}

window.customElements.define('product-menu', ProductMenu);

export { ProductMenu };