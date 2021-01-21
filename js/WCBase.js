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

    connectedCallback()
    {
        console.log("EditableField::callback connected");
    }

    disconnectedCallback()
    {
        console.log("EditableField::callback connected");
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
    checkmark_label_left: "40px"
}

// ---------------------------------------
// - HTTP Request constants
// ---------------------------------------

const API_URL = 'http://localhost:8080';
const LOGIN_URL = `${API_URL}/login`;
const LOGOUT_URL = `${API_URL}/logout`;
const RECIPE_URL = `${API_URL}/recipe`;
const PRODUCT_URL = `${API_URL}/product/fridge`;
const STEP_BY_STEP_URL = `${RECIPE_URL}/sbs`;

export 
{
     WCBase, 
     props,
     LOGIN_URL,
     LOGOUT_URL,
     RECIPE_URL,
     PRODUCT_URL,
     STEP_BY_STEP_URL
}