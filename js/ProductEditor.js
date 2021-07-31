import { PRODUCT_URL } from './WCBase.js';
import { EditorBase } from './EditorBase.js';

/**
 * This is an Editor Popup for ProductView  
 */
class ProductEditor extends EditorBase
{
    /**
     * ProductEditor Constructor function 
     * ------
     * @param {Object}      dto, holds the data of selected article
     * @param {Context}     parent, article view 
     * @param {HTMLElement} viewNode, the article view root node 
     */
    constructor( dto, parent, viewNode )
    {
        
        const template = 
        `<div class='editor__component'>
            <editor-label data-label='name'>Current Name</editor-label> 
            <text-input-row data-input='name'>New Name</text-input-row>
        </div>
        <div class='editor__component'>
            <editor-image data-label='mediaDto'>Current Image</editor-image>
            <image-input-row data-input='mediaDto'>New Image</image-input-row>
        </div>
        <button class='button update update--one-to-one'>Update</button>`;

        /**
         * Pass to the parent
         * - Entity key
         * - dto
         * - parent
         * - viewNode
         * - update url
         * - options { relatedSet, template, style }
         */
        super( 'product', dto, parent, viewNode, PRODUCT_URL, { template } ); 
    }  
}

window.customElements.define( 'product-editor', ProductEditor );

export { ProductEditor };