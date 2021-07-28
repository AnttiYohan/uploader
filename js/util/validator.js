/**
 * Set of validation
 * functions
 * 
 * 
 * Example of model:
 
    // Validation model is
    // one of a step object
    // Which should have at least these properties:
    // 1) text  : string
    // 2) image : File

    const model = [

            {
                'prop' : 'text',
                'type' : 'string',
                'empty': 'false'
            },
            {
                'prop': 'image',
                'instance': 'File'
            }
        ];

    const productModel = [

        {
            'prop': 'name',
            'type': 'string',
            'empty': 'false
        },
        {
            'prop': 'productCategory',
            'type': 'string',
            'empty': 'false
        },
        {
            'prop': [
                'id',
                'systemProductId'
            ],
            'type': 'number',
            'empty': 'false
        },
        {
            'prop': 'name',
            'type': 'string',
            'empty': 'false
        }

    ];


 */

export default function validate( obj, model )
{
    let success = false;

    if ( model && Array.isArray( model ) ) for ( const key of model )
    {
        /**
         * property list
         */
        if ( Array.isArray( key.prop ) ) 
        {
            let result = false;
            for ( const prop of key.prop )
            {
                if ( obj.hasOwnProperty( prop ) )
                {
                    result = propertyCheck( obj, prop, key );
                    break;
                }
            }

            success = result;
                
            if ( ! result )
            {
                break;
            }
        }
        else
        {
            success = propertyCheck( obj, key.prop, key );
            if ( ! success )
            {
                break;
            }
        } 
    }

    return success;
    
}

function propertyCheck( obj, prop, key )
{
    if ( obj.hasOwnProperty( prop ) )
    {
        const property = obj[ prop ];

        /**
         * Is there a type?
         */
        if ( 'type' in key )
        {
            if ( ! typeCheck( property, key.type ) )
            {
                return false;
            }
        }
        else /** Or an instance */
        if ( 'instance' in key )
        {
            if ( ! instanceCheck( property, key.instance ) )
            {
                return false;
            }
        }

        /**
         * Empty check
         */
        if ( 'empty' in key )
        {
            if ( key.empty === 'false' && isEmpty( property ) )
            {
                return false;
            }
        }

        return true;
    }
    
    return false;
}

/**
 * Check type match 
 * 
 * @param  {any}     property 
 * @param  {string}  type 
 * @return {boolean} 
 */
function typeCheck( property, type )
{
    if ( type === 'null'  && property === null ) 
    {
        return true;
    }
    if ( type === 'array' && Array.isArray( property ) )
    {
        return true;
    }
    if ( type === 'number' )
    {
        return isNaN( property ) ? false : true;
    }

    return typeof property === type;
}

/**
 * Check instance match 
 * 
 * @param  {any}     property 
 * @param  {string}  instance 
 * @return {boolean} 
 */
function instanceCheck( property, instance )
{
    return property instanceof instance;
}

function isEmpty( property )
{
    if ( property === null || property === undefined )
    {
        return true;
    }

    if ( typeof property === 'string' )
    {
        return property.length === 0;
    }
    else
    if ( typeof property === 'number' )
    {
        return property === 0;
    }
    else
    if ( typeof property === 'object' )
    {
        if ( Array.isArray( property) )
        {
            return property.length === 0;
        }

        return Object.entries( property ).length === 0;
    }

    return false;
}


export { validate };