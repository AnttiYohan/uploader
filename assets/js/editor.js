window.addEventListener("DOMContentLoaded", e => {
    setupEditor();
});

let overlay = null;
let popup   = null;

/**
 * Setups the editor by adding the needed click listeners
 */
function setupEditor()
{
    overlay       = document.getElementById("overlay");
    popup         = document.getElementById("popup");
    const tbody_users   = document.getElementById("user-records");
    const tbody_recipes = document.getElementById("recipe-records");

    // ---------------------------------------------------
    // - Iterate through user rows and add click listeners
    // ---------------------------------------------------
    for (const tr of tbody_users.children)
    {
        if (tr instanceof HTMLTableRowElement)
        {
            const id = tr.hasAttribute("data-id") ? tr.getAttribute("data-id") : 0;
            const td = tr.firstElementChild;

            td && td.addEventListener("click", e => {

                    e.preventDefault();
                    e.stopPropagation();
                    
                    overlay.style.display = "block";

                    // ----------------------------------------
                    // - Clone the row and remove the edit icon
                    // ----------------------------------------

                    const cloneRow = tr.cloneNode(true);
                    cloneRow.removeChild(cloneRow.childNodes[0]);

                    popup.appendChild(generateUserPopup(cloneRow, id));
                });


        }
    }

    // -----------------------------------------------------
    // - Iterate through recipe rows and add click listeners
    // -----------------------------------------------------

    for (const tr of tbody_recipes.children)
    {
        if (tr instanceof HTMLTableRowElement)
        {
            const id = tr.hasAttribute("data-id") ? tr.getAttribute("data-id") : 0;
            const td = tr.firstElementChild;

            td && td.addEventListener("click", e => {

                    e.preventDefault();
                    e.stopPropagation();
                    
                    overlay.style.display = "block";

                    // ----------------------------------------
                    // - Clone the row and remove the edit icon
                    // ----------------------------------------

                    const cloneRow = tr.cloneNode(true);
                    cloneRow.removeChild(cloneRow.childNodes[0]);

                    popup.appendChild(generateRecipePopup(cloneRow, id));
                });

        }
    }    
}

/**
 * Generates Editable user record into popup dialog
 * 
 * @param  {HTMLTableRowElement} tr 
 * @param  {identifier}          id
 * @return {HTMLElement} 
 */
function generateUserPopup(tr, id)
{   
    // -----------------------------------------
    // - Build a cancel button
    // -----------------------------------------    
    const buttonCancel = newTagClass("div", "popup__cancel")
    buttonCancel.addEventListener("click", e => {
        overlayOff();
    });

    // -----------------------------------------
    // - Wrap inputs into a container
    // ----------------------------------------- 

    return newTagClassChildren(
        "div", 
        "popup__container",
        [
            newTagClassChildren(
                "table",
                "popup__table",
                [
                    tr,
                    buttonCancel
                ]
            ),
            newTagClassChildren(
                "div",
                "popup__forms",
                [
                    generateRemoveForm("remove_user.php", id),
                    generateUpdateNumberForm("update_user.php", id, "Update Age:", "age")
                ]
            )
        ]);
}

/**
 * Generates Editable Recipe record into popup dialog
 * 
 * @param  {HTMLTableRowElement} tr 
 * @param  {identifier}          id
 * @return {HTMLElement} 
 */
function generateRecipePopup(tr, id)
{   
    // -----------------------------------------
    // - Build a cancel button
    // -----------------------------------------    
    const buttonCancel = newTagClass("div", "popup__cancel")
    buttonCancel.addEventListener("click", e => {
        overlayOff();
    });

    // -----------------------------------------
    // - Wrap inputs into a container
    // ----------------------------------------- 

    return newTagClassChildren(
        "div", 
        "popup__container",
        [
            newTagClassChildren(
                "table",
                "popup__table",
                [
                    tr,
                    buttonCancel
                ]
            ),
            newTagClassChildren(
                "div",
                "popup__forms",
                [
                    generateRemoveForm("remove_recipe.php", id),
                    generateUpdateStringForm("update_recipe.php", id, "Update Instructions:", "instructions")
                ]
            )
        ]);
}

/**
 * Generates a remove form with
 * a hidden input with identifier
 * 
 * @param  {string}          action 
 * @param  {int|string}      identifier
 * @return {HTMLFormElement} 
 */
function generateRemoveForm(action, identifier)
{
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", "post");
    form.appendChild(newTagClassHTML("label", "popup__label", "remove"));
    form.appendChild(hiddenInputNameValue("id", identifier));
    form.appendChild(submitInputClassHTML("popup__submit", "remove"));

    return form;   
}

/**
 * Generates a update form with
 * a hidden input with identifier and
 * an number input for update value
 * 
 * @param  {string}          action 
 * @param  {int|string}      identifier
 * @param  {string}          UpdateLabel
 * @param  {string}          UpdateName
 * @return {HTMLFormElement} 
 */
function generateUpdateNumberForm(action, identifier, text, updateKey)
{
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", "post");
    form.appendChild(labelInputNumber(text, updateKey));
    form.appendChild(hiddenInputNameValue("id", identifier));
    form.appendChild(submitInputClassHTML("", "update"));

    return form;   
}
/**
 * Generates a update form with
 * a hidden input with identifier and
 * an number input for update value
 * 
 * @param  {string}          action 
 * @param  {int|string}      identifier
 * @param  {string}          UpdateLabel
 * @param  {string}          UpdateName
 * @return {HTMLFormElement} 
 */
function generateUpdateStringForm(action, identifier, text, updateKey)
{
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", "post");
    form.appendChild(labelInputText(text, updateKey));
    form.appendChild(hiddenInputNameValue("id", identifier));
    form.appendChild(submitInputClassHTML("", "update"));

    return form;   
}
/**
 * Generates a from with post method
 * and action as in input
 * 
 * @param  {string}          action
 * @return {HTMLFormElement} 
 */
function generateForm(action)
{
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", "post");

    return form;
}

/**
 * Clears the popup and turns the overlay off
 */
function overlayOff()
{
    deleteChildren(popup);
    overlay.style.display = "none";
}

/**
 * Deletes all child elements of the input elem
 * 
 * @param {HTMLElement} elem 
 */
function deleteChildren(elem)
{  
    while (elem.firstChild) elem.removeChild(elem.lastChild);
}

/**
 * Creates a label/input pair
 * 
 * @return {HTMLImageElement} 
 */
function labelInputNumber(text, name)
{
    const
    div = document.createElement("div");

    const
    label = document.createElement("label");
    label.setAttribute("for", name);
    label.textContent = text;

    div.appendChild(label);
    div.appendChild(numberInputNameClass(name));
    
    return div;
}

/**
 * Creates a label/input[text] pair
 * 
 * @return {HTMLImageElement} 
 */
function labelInputText(text, name)
{
    const
    div = document.createElement("div");

    const
    label = document.createElement("label");
    label.setAttribute("for", name);
    label.textContent = text;

    div.appendChild(label);
    div.appendChild(textInputNameClass(name));
    
    return div;
}

/**
 * Creates a Input Number Element
 * 
 * @return {HTMLImageElement} 
 */
function numberInputNameClass(name, cls = "")
{
    const
    elem = document.createElement("input");
    elem.setAttribute("type", "number");
    elem.setAttribute("name", name);

    if (cls.length) elem.setAttribute("class", cls);

    return elem;
}

/**
 * Creates a Input Text Element
 * 
 * @return {HTMLImageElement} 
 */
function textInputNameClass(name, cls = "")
{
    const
    elem = document.createElement("input");
    elem.setAttribute("type", "text");
    elem.setAttribute("name", name);

    if (cls.length) elem.setAttribute("class", cls);

    return elem;
}

/**
 * Creates a submit input Element
 * 
 * @return {HTMLImageElement} 
 */
function submitInputClassHTML(cls, html)
{
    const
    elem = document.createElement("input");
    elem.setAttribute("type", "submit");

    if (cls.length) elem.setAttribute("class", cls);

    elem.textContent = html;

    return elem;
}

/**
 * Creates a hidden input
 * 
 * @return {HTMLImageElement} 
 */
function hiddenInputNameValue(name, value)
{
    const
    elem = document.createElement("input");
    elem.setAttribute("type", "hidden");
    elem.setAttribute("name",  name);
    elem.setAttribute("value", value);

    return elem;
}

/**
 * Creates a new HTMLElement with class attribute
 * 
 * @param  {string}      tag 
 * @param  {string}      cls
 * @return {HTMLElement} 
 */
function newTagClass(tag, cls)
{
    const
    elem = document.createElement(tag);
    elem.setAttribute("class", cls);

    return elem;
}

/**
 * Creates a new HTMLElement with class attribute and child elements
 * 
 * @param  {string}      tag
 * @param  {string}      class
 * @param  {array}       children
 * @return {HTMLElement} 
 */
function newTagClassChildren(tag, cls, children)
{
    const elem = newTagClass(tag, cls);

    for (const child of children)
    {
        elem.appendChild(child);
    }

    return elem;
}

/**
 * Creates a HTMLElement with class attribute and a inner Text node
 * 
 * @param  {string}      tag 
 * @param  {string}      cls 
 * @param  {string}      html
 * @return {HTMLElement} 
 */
function newTagClassHTML(tag, cls, html)
{
    const
    elem = newTagClass(tag, cls);
    elem.innerHTML = html;

    return elem;
}