import { MapReaderBase } from './MapReaderBase.js';

/**
 * ProductReader is a parser/formatter, intended to
 * generate a 'human readable' representation of
 * a 'ProductDTO' object.
 * The representation is generated into
 * a HTML document fragment.
 * 
 * The HTMLElements are generated in this format: 
 * ----------------------------------------------
 * <div class='report'> <!-- the root node, which contains every other element -->
 *   <!-- A simple, shallow entry with a primitive value -->
 *   <h3 class='report__entry--simple'>
 *     <span class='report__span'>{dto key}</span>
 *     <span class='report__span'>{dto value}</span>
 *   </h3>
 *   <!-- An entry with child data, value is an object or array with child entries -->
 *   <div class='report__entry--deep'>
 *     <!-- Entry header, displays the dto key here -->
 *     <h3 class='report__header'>{dto key}</h3>
 *     <!-- Entry's child entries from an array of objects -->
 *     <p class='report__entry--child'>
 *       <!-- a header span, displaying the title of this child entry -->
 *       <span class='report__span--header'>{child-title}</span>
 *       <!-- 1..N spans, displaying the child entry's key/value pair(s) -->
 *       <span class='report__span--child'>{child entry key}: {child entry value}</span>
 *       ... rest of the child entry's key/value pair span sets
 *     </p>
 *     ... rest of the dto entry's child entries
 *   </div>
 *   ... rest of the dto entries
 * </div>
 * ---------------------------------------------- 
 * 
 */
class ProductReader extends MapReaderBase
{
    constructor( dto )
    {
        super();

        /**
        * Define the product model
        */
        const model = new Map();

        /**
         * Iterate through the ProductDto,
         * add entries to the map, using 
         * 'key', the value is an object
         * with certain key-value pairs,
         * which contain specific values
         * to tell the MapReaderBase,
         * which data will be rendered,
         * and in what fashion.
         */
        for ( const key in dto )
        {
            const value   = dto[ key ];

            /**
             * Handle the special cases with a value type
             * other that a primitive.
             * Product Image is only special case,
             * with 'image' type
             */
            if ( key === 'mediaDto' )
            {
                model.set( key, MapReaderBase.getImageData( 'Product Image', value ) );
                continue;
            }
            /**
             * For primitives, we need value and type
             */
            model.set( key, MapReaderBase.getActions( value ) );
      
        }

        this.model = model;
    }
}

export { ProductReader };