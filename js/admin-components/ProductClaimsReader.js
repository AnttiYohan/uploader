import { ReaderBase } from "./ReaderBase";
import { newTagClassHTML, newTagClassChildren } from '../util/elemfactory.js';


/**
 * ReaderBase is a response DTO parser tool base object,
 * Which are used to build by extension, for instance
 * ProductClaimsReader, which reads a product claims response.
 * The Readers are intended to parse one entity,
 * If an array of entities are expected, iterate through the 
 * entities, and parse the DTOs with reader one itaration at time
 */
class ProductClaimsReader extends ReaderBase
{
    constructor()
    {
        super([
            {
                entity: 'product',
                type: 'singular',
                keys:
                [
                    'name',
                    'id'
                ],
                relationPhrase: 'is claimed by',
                relationEmpty: 'No claims'
            },
            {
                entity: 'claims',
                type: 'plural',
                keys:
                [
                    'taxonomy',
                    'title',
                    'id'
                ]
            }
        ]);
    }

    generateRow( response )
    {
        return this.fetchHTML( response );
    }
}

export default ProductClaimsReader;