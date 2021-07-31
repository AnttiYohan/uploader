import { ARTICLE_URL } from './WCBase.js';
import { EditorBase } from './EditorBase.js';

/**
 * This is an Editor Popup for ArticleView  
 */
class ArticleEditor extends EditorBase
{
    /**
     * ArticleEditor Constructor function 
     * ------
     * @param {Object}      articleDto, holds the data of selected article
     * @param {Context}     parent, article view 
     * @param {HTMLElement} viewNode, the article view root node 
     */
    constructor( articleDto, parent, viewNode )
    {
        const template =
            `<div class='editor__component'>
                <editor-label data-label='title'>Current</editor-label> 
                <text-input-row data-input='title'>New Title</text-input-row>
            </div>
            <div class='editor__component'>
                <editor-image data-label='mediaDto'>Current Image</editor-image>
                <image-input-row data-input='mediaDto'>New Image</image-input-row>
            </div>
            <div class='editor__component'>
                <editor-label data-label='description'>Description</editor-label>
                <text-input-row data-input='description'>Edited</text-input-row>
            </div> 
            <div class='editor__component'>
                <editor-label    data-label='text'>Content</editor-label>
                <text-input-area data-input='text'>Edited</text-input-area>
            </div>
            <div class='editor__component'>
                <editor-label    data-label='mainImageLink'>Main Image Link</editor-label>
                <text-input-row  data-input='mainImageLink'>Edited</text-input-row>
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
         super( 'article', articleDto, parent, viewNode, ARTICLE_URL, { template } ); 
    }
}

window.customElements.define( 'article-editor', ArticleEditor );

export { ArticleEditor };