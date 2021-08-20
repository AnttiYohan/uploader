import { imgClassSrc, newTagClassChildren, newTagClassHTML } from "../util/elemfactory.js";

/**
 * MapReaderBase is a DTO parser base object, which is
 * intended to be extended.
 * The extending class provides the DTO model in
 * Which are used to build by extension, for instance
 * ProductClaimsReader, which reads a product claims response.
 * The Readers are intended to parse one entity,
 * If an array of entities are expected, iterate through the 
 * entities, and parse the DTOs with the reader one itaration at time
 */
class MapReaderBase
{
    /**
     * The child class injects a model map
     * into the the constructor
     * 
     * @param {Map} model 
     *
    constructor()
    {
    }*/

    set model( model )
    {
        this.mModel = model;
    }

    /**
     * Parses the dto using the model
     * 
     */
    parse()
    {
        /**
         * Stores the entries here,
         * entry is a HTMLDivElement,
         * which contains the detailed data
         * from a DTO entry.
         * If the entry contains children,
         * their data is generated also in the entry.
         */
        const entries = [];

        for ( const [ key, actions ] of this.mModel )
        {
            if ( actions.get( 'type' ) === 'image' )
            {
                entries.push( this.getEntityImageEntry( actions ) );
                continue;
            }
            else
            if ( actions.get( 'type' ) === 'object' && actions.has( 'child_keys' ) )
            {
                /**
                 * Resolve the entry's children, which are an array of objects.
                 * Store the result, generated HTMLElement, into the
                 * 'entries' array
                 */
                entries.push( this.getEntryFromChildObjects( key, actions ) );
                continue;
            }
            else 
            if ( actions.get( 'type' ) === 'array' && actions.get( 'value' ).length )
            {
                /**
                 * Resolve the entry's children, which are an array of primitives.
                 * Store the result, generated HTMLElement, into the
                 * 'entries' array
                 */
                entries.push( this.getEntryFromArray( key, actions ) );
                continue;
            }

            /**
             * Create a html element which contains the
             * entry 'key' and 'value'
             */
            entries.push( newTagClassChildren(

                'h3',
                'report__entry--simple',
                [
                    newTagClassHTML( 'span', 'report__span', key ),
                    newTagClassHTML( 'span', 'report__span', actions.get( 'value' ) )
                ]

            ));    
        }

        return newTagClassChildren(

            'div',
            'report',
            entries

        );
    }

    /**
     * Creates a HTMLElelemet struct with:
     * - image title
     * - image element | paragraph with error message
     * 
     * @param  {Map}         actions 
     * @return {HTMLElement} 
     */
    getEntityImageEntry( actions )
    {
        return newTagClassChildren(

            'div',
            'report__entry--image',
            [
                newTagClassHTML( 'h3', 'report__header', actions.get( 'title' ) ),
                ! actions.get( 'data' )
                ? newTagClassHTML
                ( 
                    'h4', 
                    'report__header',
                    'Image data not available'
                )
                : imgClassSrc
                ( 
                    'report__dto-image', 
                    `data:${actions.get( 'fileType' )};base64,${actions.get( 'data' )}`
                )
            ]
        );    
    }
    /**
     * Generates a HTMLElement structure with
     * a container and child values,
     * The data is derived from a DTO entry,
     * which has an array of primitives
     * 
     * @param  {string}      title
     * @param  {Map}         actions 
     * @return {HTMLElement} 
     */
    getEntryFromArray( title, actions )
    {
        /**
         * Iterate throuhg the child entities,
         * and fetch the values from array
         */
        const childParagraphs = [];
        
        for ( const primitive of actions.get( 'value' ) )
        {
            const spans = [];
            spans.push( newTagClassHTML(

                 'span', 
                 'report__span--child', 
                 actions.get( 'singular' )

            ));

            spans.push( newTagClassHTML(

                'span', 
                'report__span--child', 
                `${primitive}`

           ));

            childParagraphs.push( newTagClassChildren(

                'p',
                'report__entry--child',
                spans

            ));
        }

        return newTagClassChildren(

            'div',
            'report__entry--deep',
            [
                newTagClassHTML( 'h3', 'report__header', title ),
                ...childParagraphs
            ]
        ); 
    }

    /**
     * Generates a HTMLElement structure with
     * a container and child elements,
     * that contains the details of an DTO key entry,
     * which has an array of child objects
     * 
     * @param  {string}      title
     * @param  {Map}         actions 
     * @return {HTMLElement} 
     */
    getEntryFromChildObjects( title, actions )
    {
        /**
         * Iterate throuhg the child entities,
         * and get fetch the entries by 'child_keys'
         */
        const largeKeys = actions.has( 'large' ) 
                        ? actions.get( 'large' )
                        : [];

        const childParagraphs = [];
        
        for ( const entity of actions.get( 'value' ) )
        {
            const spans  = [];
            const larges = [];
            spans.push( newTagClassHTML(

                'span', 
                'report__span--child', 
                actions.get( 'singular' )

            ));

            for ( const key of actions.get( 'child_keys' ) )
            {
                if ( key === 'mediaDto' )
                {
                    /**
                     * Generate an inline thumbnail
                     */
                    const image = MapReaderBase.getImageData
                    ( 
                        `${actions.get( 'singular' )} image`,
                         entity[ key ]
                    );

                    spans.push( 
                        
                        ! image.get( 'data' )
                        ? newTagClassHTML( 'span', 'report__span--child', 'Image N/A' )
                        : imgClassSrc(

                            'report__image--thumbnail',
                            `data:${image.get( 'fileType' )};base64,${image.get( 'data' )}`                            

                    ));
                    continue;
                }

                /**
                 * Check if the key is intended to be a large dataset
                 */
                let isLarge = false;
                for ( const largeKey of largeKeys )
                {
                    if ( key === largeKey )
                    {
                        isLarge = true;
                        break;
                    }
                }

                if ( isLarge )
                {
                    larges.push( newTagClassHTML(

                        'p',
                        'report__row',
                        entity[ key ]

                    ));
                    continue;
                }

                spans.push( newTagClassHTML(

                    'span',
                    'report__span--child',
                    `${key}: ${entity[ key ]}`

                ));
            }

            const spansAndLarges = [];
            spansAndLarges.push(newTagClassChildren(

                'p',
                'report__entry--child',
                spans

            ));
            spansAndLarges.push(...larges);

            childParagraphs.push( newTagClassChildren(
                
                'div',
                'report__entry--deep',
                [
                    newTagClassChildren(

                        'p',
                        'report__entry--child',
                        spans
        
                    ),
                    ...larges
                ]   
            ));
        }

        return newTagClassChildren(

            'div',
            'report__entry--deep',
            [
                newTagClassHTML( 'h3', 'report__header', title ),
                ...childParagraphs
            ]
            
        ); 
    }
 
    /**
     * Parses and returns either
     * the main image, or thumbnali source
     * as base64 encoded string.
     * 
     * The function tries first to read the 
     * main image, if it is not present,
     * it tries to read the image thumbnail.
     * 
     * @param  {MediaDto} mediaDto 
     * @return {string}   base64encoded string, the image source 
     */
    static imageFromMediaDto( mediaDto )
    {
        let data  = null;
        let type  = '';

        let image = mediaDto.image;
        if ( image )
        {
            data = image.data;
            type = image.fileType;
        }
        if ( ! image )
        {
            image = mediaDto.thumbnail;
            if ( image )
            {
                data = image.data;
                type = image.type;
            }
        }

        return { data, type }
    }

    /**
     * Determines and returns the string representation
     * of the type of the 
     * passed param 'value'.
     * 
     * @param  {any}       value 
     * @return {string}    type
     */
    static getValueType( value )
    {
        let   type    = typeof value;
        
        /**
         * Determine some special cases for type:
         * - check for array, if type == 'object'
         * - check for numberic string, if type == 'string'
         */
        if ( type === 'object' )
        {
            if ( Array.isArray( value ) )
            {
                type = 'array';
            }
            else
            if ( value === null )
            {
                type = 'null';
            }
        }
        else
        if ( type === 'string' && ! isNaN( value ) )
        {
            type = 'number';
        }

        return type;
    }

    /**
     * Obtains the image source and image filetype
     * from a 'MediaDto'
     * 
     * @param  {MediaDto} mediaDto 
     * @return {Map}      image data base64, image format
     */
    static getImageData( title, mediaDto )
    {
        const { data, type } = MapReaderBase.imageFromMediaDto( mediaDto );

        if ( data )
        {
            const result = new Map();

            result.set( 'type', 'image' );
            result.set( 'title', title );
            result.set( 'data', data );
            result.set( 'fileType', type );

            return result;
        }

        /**
         * There were no image data available,
         * return a map with 
         * type->image
         * data->null
         */
        const result = new Map();

        result.set( 'type', 'image' );
        result.set( 'data', null );
        result.set( 'title', title );

        return result;
    }

    static getActions( value )
    {
        const type    = MapReaderBase.getValueType( value );
        const actions = new Map();
        actions.set( 'type', type );
        actions.set( 'value', value );
        
        return actions;
    }


    static getObjectActions( singular, childKeys, value, options = new Map )
    {
        const actions = new Map();
        actions.set( 'type', 'object' );
        actions.set( 'value', value );
        actions.set( 'singular', singular );
        actions.set( 'child_keys', childKeys );

        if ( options.has( 'large' ) )
        {
            actions.set( 'large', options.get( 'large' ) );
        }
        
        return actions;
    }

    static getArrayActions( singular, arrayElemType, value )
    {
        const actions = new Map();
        actions.set( 'type', 'array' );
        actions.set( 'value', value );
        actions.set( 'singular', singular );
        actions.set( 'array_elem_type', arrayElemType );

        return actions;
    }
}

export { MapReaderBase };