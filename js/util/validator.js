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
                'empty': false
            },
            {
                'prop': 'image',
                'instnace': 'File'
            }
        ];

    const productModel = [

        {
            'name': 'name'
        }

    ];


 */

export default function validate( obj, model )
{
    let success = false;

    for ( const key of model )
    {
        if ( obj.hasOwnProperty( key.prop ) )
        {
            const property = obj[ key.prop ];

            /**
             * Is there a type?
             */
            if ( 'type' in key )
            {
                success = typeCheck( property, key.type );
                if ( ! success )
                {
                    break;
                }
            }
            else /** Or an instance */
            if ( 'instance' in key )
            {
                success = instanceCheck( property, key.instance )
                if ( ! success )
                {
                    break;
                }
            }

            /**
             * Empty check
             */
            if ( 'empty' in key )
            {
                if ( key.empty === 'false' && isEmpty( property ) )
                {
                    success = false;
                    break;
                }
            }

            success = true;
        }
        else
        {
            success = false;
            break;
        }
    }

    return success;
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
    if ( property === null || propery === undefined )
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