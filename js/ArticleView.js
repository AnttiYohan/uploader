import { ARTICLE_URL } from './WCBase.js';
import { ViewBase } from './ViewBase.js';

/**
 * Article View is one of the Top Level Views in the
 * BabyFoodWorld Admin Uploader Tool
 * -------
 * Manages the articles in the BFW server
 */
class ArticleView extends ViewBase
{
    constructor()
    {
        const template =
        `<text-input-row  data-input='title' required>Title</text-input-row>
        <image-input-row  data-input='image' required>Article Image</image-input-row>
        <text-input-row   data-input='description' required>Description</text-input-row>
        <text-input-area  data-input='text' data-rows='24' required>Content</text-input-area>
        <number-input-row data-input='likes'>Likes</number-input-row>
        <text-input-row   data-input='mainPictureLink'>Main Image Link</text-input-row>`;

        /**
         * Pass to the base:
         * - entity name
         * - route
         * - options { editable, responseKey, titleKey, template }
         */
        super
        (
            'article',
            ARTICLE_URL,
            { 
                editable: true, 
                responseKey: 'articleDto', 
                titleKey: 'title',
                template
            }
        );    
    }
}

window.customElements.define('article-view', ArticleView);

export { ArticleView };