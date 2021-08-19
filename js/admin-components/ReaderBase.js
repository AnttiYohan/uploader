import { newTagClassHTML, newTagClassChildren } from "../util/elemfactory.js";

/**
 * ReaderBase is a response DTO parser tool base object,
 * Which are used to build by extension, for instance
 * ProductClaimsReader, which reads a product claims response.
 * The Readers are intended to parse one entity,
 * If an array of entities are expected, iterate through the 
 * entities, and parse the DTOs with the reader one itaration at time
 */
class ReaderBase
{
    constructor( model )
    {
        this.mModel = model;
    }

    /**
     * Parses a DTO unit from a response with a singular model
     * or a 1:N two-entity relation.
     * Generates a HTML element structure, that enbodies the 
     * data contents.
     * 
     * @param  {object}      response 
     * @return {HTMLElement} 
     */
    fetchHTML( response )
    {
        const elements = [];

        if ( this.mModel && Array.isArray( this.mModel ) ) 
        {     
            let empty  = '';
            let phrase = '';

            for ( const entry of this.mModel )
            {
                const { entity, keys, type } = entry;

                const children = [];
                const entityString = entity.toUpperCase();
                
                /**
                 * Fetch the latest relational phrases
                 */
                if ( 'relationEmpty'  in entry ) empty  = entry.relationEmpty;
                if ( 'relationPhrase' in entry ) phrase = entry.relationPhrase;

                /**
                 * Read the response entity key
                 */
                const responseEntity = response[ entity ];

                /**
                 * If the key is present, parse the entity data in
                 * HTML elements
                 */
                if ( responseEntity )
                {
                    if ( Array.isArray( responseEntity ))
                    {
                        if ( responseEntity.length )
                        {
                            children.push( newTagClassHTML( 'h2', 'stat__key', phrase ) );

                            for ( const entity of responseEntity )
                            {
                                const valueString = this.getResponseEntityString( entity, keys )
                                children.push
                                (
                                    newTagClassHTML( 'p', 'stat__value', valueString )
                                );
                            }
                        }
                        else
                        {
                            children.push( newTagClassHTML( 'p', 'stat__value', empty ) );
                        }
                    }
                    else
                    {
                        const keyElement = newTagClassHTML( 'h2', 'stat__key', entityString );
                        children.push( keyElement );
                    
                        const valueString = this.getResponseEntityString( responseEntity, keys );

                        children.push( 
                            newTagClassHTML
                            (
                                'h4',
                                'stat__value',
                                valueString
                            )
                        );
                    }
                    

                    /**
                     * Singular
                     */
                    if ( type && type === 'singular' )
                    {
                        elements.push
                        (
                            newTagClassChildren
                            (
                                'div',
                                'stat__header',
                                children
                            )
                        );
                    }
                    else 
                    {
                        elements.push
                        (
                            newTagClassChildren
                            (
                                'div', 
                                'stat__entity', 
                                children 
                            ) 
                        );
                    }
                }
            }
        }


        return elements.length 
               ? newTagClassChildren( 'div', 'stat__entry', elements )
               : newTagClassHTML( 'h2', 'stat__entry', 'No data' );
    }


    /**
     * Parses the response entity object,
     * Returns the all values of a response entity
     * as an array of strings
     * 
     * @param   {Object}         responseEntity 
     * @param   {Array<string>}  keys 
     * @return  {Array<string>}
     */
    getResponseEntityValues( responseEntity, keys )
    {
        const values = [];

        for ( const key of keys )
        {
            const value = responseEntity[ key ];
            if ( value ) values.push( value );
        }

        return values;
    }

    /**
     * Constructs a string with all of the key/value pairs in a response entity
     * 
     * @param  {object}        responseEntity 
     * @param  {Array<String>} keys 
     * @return {String}
     */
    getResponseEntityString( responseEntity, keys )
    {
        let string = '';
        let index  = 0;

        for ( const key of keys )
        {
            if ( index > 0 ) string += ', ';
            string += `${key}: ${responseEntity[ key ]}`;
            index++;
        }

        return string;
    }      
}

export { ReaderBase };