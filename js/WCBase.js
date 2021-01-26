/**
 * WebComponent base class
 */
class WCBase extends HTMLElement
{
    constructor(title = "")
    {
        super();
        this.mTitle = title;
    }

    setupStyle(css)
    {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes()
    {
        console.log("EditableField::connected callback called");
        return ["disabled"];
    }

    get disabled()
    {
        return this.hasAttribute("disabled");
    }

    set disabled(value)
    {
        if (value)
            this.setAttribute("disabled", "");
        else
            this.removeAttribute("disabled");
    }

    get title()
    {
        return this.mTitle;
    }

    set title(value)
    {
        this.mTitle = value;
    }

}

const props = 
{
    bg: "#ffffff",
    color: "#222",
    border: "#888",
    lineHeight: "32px",
    translateUnit: "16px",
    inputBg: "#787882",
    inputColor: "#f2f2f8",
    inputBorderGlare: "#c8c2d2",
    inputBorderShade: "#484858",
    buttonBg: "#232328",
    buttonColor: "#e8e8f2",
    buttonBorderShade: "#626268",
    buttonBorderGlare: "#b2b2b8",
    buttonHoverBg: "#383842",
    green: "#69ef9e",
    red: "#ff6868",
    blue: "#68aeff",
    darkgrey: "#6d6d6d",
    lightgrey: "#eeeeee",
    grey: "#bcbcbc",
    disabled: "#e3e3e3",
    header_font_size: "16px",
    text_font_size: "14px",
    small_font_size: "12px",
    checkmark_height: "16px",
    checkmark_width: "32px",
    checkmark_label_left: "40px",
    ingredient_height: "24px",
    admin_bar_height: "48px",
    admin_bar_bg: "#ffeeee",
    logo_side: "48px",
    uploader_max_width: "600px",
    button_side: "32px",
    frame_width: "300px",
    inner_pad: "4px"
};

// ----------------------------------------
// - App enums
// ---------------------------------------

const MEASURE_UNIT_ENUM =
[
    'ML', 
    'LITER', 
    'GR', 
    'KG', 
    'PIECES', 
    'CUP', 
    'CUPS', 
    'TSP', 
    'TBSP', 
    'CLOVE', 
    'CAN', 
    'CANS', 
    'SLICE', 
    'SLICES', 
    'A_PINCH_OF', 
    'NONE'    
];

const MEALTYPES_ENUM =
[
    'BREAKFAST', 
    'LUNCH', 
    'DINNER', 
    'SNACK', 
    'DESSERT', 
    'APPETIZER', 
    'SALAD', 
    'SOUP', 
    'SMOOTHIE', 
    'BEVERAGES'    
];

const PRODUCT_CATEGORY_ENUM =
[
    'FRUITS',
    'VEGETABLES',
    'BREAD_AND_PASTRY',
    'SPICES',
    'MEAT',
    'DAIRY',
    'SEAFOOD',
    'OTHERS',
    'FROZEN_AND_CONVENIENCE',
    'GRAINS',
    'DRINKS',
    'NONE'
];

// ---------------------------------------
// - HTTP Request constants
// ---------------------------------------

const API_URL = 'http://localhost:8080';
const LOGIN_URL = `${API_URL}/perform_login`;
const LOGOUT_URL = `${API_URL}/logout`;
const RECIPE_URL = `${API_URL}/recipe`;
const PRODUCT_URL = `${API_URL}/product`;
const FRIDGE_PRODUCT_URL = `${PRODUCT_URL}/fridge`;
const STEP_BY_STEP_URL = `${RECIPE_URL}/sbs`;

export 
{
     WCBase, 
     props,
     MEASURE_UNIT_ENUM,
     MEALTYPES_ENUM,
     PRODUCT_CATEGORY_ENUM,
     LOGIN_URL,
     LOGOUT_URL,
     RECIPE_URL,
     PRODUCT_URL,
     FRIDGE_PRODUCT_URL,
     STEP_BY_STEP_URL
};