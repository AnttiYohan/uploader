/**
 * WebComponent base class
 */
class WCBase extends HTMLElement
{
    constructor()
    {
        super();
        this.ENTER = 13;
        this.KEYUP = 38;
        this.KEYDOWN = 40;
    }

    setupStyle(css)
    {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.appendChild(style);
    }

    setupTemplate(content)
    {
        const template = document.createElement("template");
        template.innerHTML = content;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    emit(type, msg = undefined)
    {
        const options = { bubbles: true, composed: true };

        if ( msg ) options['detail'] = msg;

        this.shadowRoot.dispatchEvent(new CustomEvent( type, options ));
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
    uploader_row_height: "48px",
    uploader_row_pad: "8px",
    ingredient_height: "24px",
    admin_bar_height: "48px",
    admin_bar_bg: "#ffeeee",
    logo_side: "48px",
    uploader_max_width: "600px",
    button_side: "32px",
    /*frame_width: "300px",*/
    frame_width: "40%",
    inner_pad: "4px",
    asterisk_size: "12px",
    file_column_width: "48px",
    thumbnail_side: "32px",
    list_row_height: "64px",
    list_image_space: "64px",
    list_button_space: "48px",
    text_vt_pad: "16px",
    input_width: "153px",
    row_label_width: "128px",
    row_input_height: "32px",
    frame_width_value: 300,
    color: 
    {
        dark:   '#656565',
        grey:   '#aeaeae',
        light:  '#eeeeee',
        red:    '#f00d0d',
        white:  '#ffffff',
        text_dark:   '#282828'
    }
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
//const API_URL = 'https://babyfoodworld.app';
const LOGIN_URL = `${API_URL}/perform_login`;
const LOGOUT_URL = `${API_URL}/logout`;
const ARTICLE_URL = `${API_URL}/article`;
const RECIPE_URL = `${API_URL}/recipe`;
const RECIPE_ALL_URL = `${RECIPE_URL}/all`;
const RECIPE_WITH_STEPS = `${RECIPE_URL}/with-steps`;
const PRODUCT_URL = `${API_URL}/product`;
const PRODUCT_TEXT_URL = `${PRODUCT_URL}/text`;
const FRIDGE_PRODUCT_URL = `${PRODUCT_URL}/fridge`;
const UPDATE_RECIPE_URL = `${RECIPE_URL}`;
const UPDATE_FIELDS_URL = `${RECIPE_URL}/image`;
const UPDATE_PRODUCTS_URL = `${RECIPE_URL}/products`;
const UPDATE_PRODUCTS_ADD_URL = `${UPDATE_PRODUCTS_URL}/add`;
const UPDATE_STEPS_URL = `${RECIPE_URL}/steps`;
const UPDATE_STEPS_ADD_URL = `${UPDATE_STEPS_URL}/add`;
const RECIPE_STEP_THUMBNAILS_URL = `${RECIPE_URL}/thumbnail`;
const RECIPE_MEDIA_URL = `${RECIPE_URL}/media`;
const RECIPE_STEPS_MEDIA_URL = `${RECIPE_URL}/steps/media`;

export 
{
     WCBase, 
     props,
     MEASURE_UNIT_ENUM,
     MEALTYPES_ENUM,
     PRODUCT_CATEGORY_ENUM,
     API_URL,
     LOGIN_URL,
     LOGOUT_URL,
     ARTICLE_URL,
     RECIPE_URL,
     RECIPE_ALL_URL,
     RECIPE_MEDIA_URL,
     RECIPE_WITH_STEPS,
     RECIPE_STEPS_MEDIA_URL,
     PRODUCT_URL,
     PRODUCT_TEXT_URL,
     FRIDGE_PRODUCT_URL,
     RECIPE_STEP_THUMBNAILS_URL,
     UPDATE_RECIPE_URL,
     UPDATE_FIELDS_URL,
     UPDATE_PRODUCTS_URL,
     UPDATE_PRODUCTS_ADD_URL,
     UPDATE_STEPS_URL,
     UPDATE_STEPS_ADD_URL
};