

/**
 * Acts as an input hub.
 * Store all view input refereces here,
 * and collect the values,
 * call reset and other fucntions
 * collectively with one call
 * from here
 * ---------
 * @property {array} mStore
 */
class InputOperator
{
    constructor(key, inputArray = [], options = {})
    {
        if (typeof key !== 'string')
        {
            throw new Error('InputOperator::constructor(): key must be a string');
        }

        /**
         * The key for request header
         * ------
         * @type {string}
         */
        this.mKey = key;

        /**
         * Centralized storage for input element references
         * -------------
         * @type {array}
         */
        this.mStore = [];

        /**
         * Special property for main image input
         * ------------
         * @type {File}
         */
        this.mImage = undefined;

        if (Array.isArray(inputArray)) this.load(inputArray);
    }

    getInput(name)
    {
        return this.mStore.find(elem => elem.dataset.input === name);
    }


    load(array)
    {
        for (const element of array)
        {
 
            if (element.localName === 'image-input-row')
            {
                this.setImageInput(element);
            }
            else 
            {
                this.add(element);
            }
        }
    }
    
    /**
     * Add an InputElement reference
     * into the Operator storage
     * @param {InputBase|MultiEntryRow} element 
     */
    add(element)
    {
        console.log(`Input element ${element.localName} added`);
        this.mStore.push(element);
    }

    /**
     * Store the image input here
     */
    setImageInput(element)
    {
        console.log(`Image input ${element.localName} set`);
        this.mImage = element;
    }

    /**
     * size of the store
     * ----
     * @return {number}
     */
    get size()
    {
        return this.mStore.length;
    }

    /**
     * Compiles all input values into
     * an array
     * @return {Array<object>}
     */
    values()
    {
        const result = [];
        
        this.mStore.forEach(element => 
            {
                result.push(element.object()); 
            });

        return result;
    }

    /**
     * Generates a request object from
     * the input collection values
     * ----------------
     * @return {object}
     */
    requestObject()
    {
        const dataObject = this.values();

        if ( dataObject )
        {
            return { title: this.mKey, data: JSON.stringify(dataObject) };
        }

        return undefined;
    }

    processInputs()
    {
        const dataObject = [];
        let   success = true;

        console.log(`InputOperator::processInputs()`);

        this.mStore.forEach(element => 
        {
            console.log(`Processing ${element.mKey}`);

            const result = element.object();

            if ( result === undefined )
            {
                console.log(`${element.mKey} not set, required? ${element.required}`);

                if ( element.required )
                {
                    success = false;
                    element.notifyRequired();
                }
            }
            else
            {
                console.log(`${element.mKey} result: ${result}`);
                dataObject.push(result);
            }
        });

        console.log(`Results read from ${dataObject.length} element`);

        const image = this.imageFile();

        if ( ! image ) 
        {
            this.mImage.notifyRequired();
            console.log(`Image file not set`);
            success = false;
        }

        if ( success && dataObject.length )
        {
            return { title: this.mKey, data: JSON.stringify(dataObject) };
        }
        
        return undefined;
    }
    
    /**
     * 
     * @return {File|null}
     */
    imageFile()
    {
        try
        {
            return this.mImage.value;
        }
        catch (error) {}

        return undefined;
    }

    reset()
    {
        this.mImage.reset();
        this.mStore.forEach(element => element.reset());
    }

    notifyRequired()
    {
        this.mImage.notifyRequired();
        this.mStore.forEach(element =>
            {
                //if (element.)
                element.notifyRequired()
            });
    }

    /**
     * Displays input data
     * in request form
     */
    printRequest()
    {
        console.log(`InputOperator: forming a request of input data`);

        let index = 0;
        const objList = this.values();

        if ( ! objList || objList.length === 0)
        {
            console.log(`No objects found, nothing to output.`);
            return;
        }

        console.log(`InputOperator: there are ${objList.length} input(s) besides image input`);
        
        for (const obj of objList)
        {
            index++;
            //console.log(`Input ${index} ${obj.localName}`);
            
            //const type   = obj.type;
            //const kv     = obj.object();
            
            let keys = Object.keys(obj);
            let value = obj[keys[0]];

            console.log(`${keys[0]} => ${value}`);

            if (Array.isArray(value))
            {
                for (const item of value)
                {
                    if (typeof item === 'object') for (const key in item)
                    {
                        console.log(`${key} => ${item[key]}`);
                    }
                    else
                    {
                        console.log(`${item}`);
                    }
                }
            }
            else
            if (typeof value === 'object')
            {
                for (const key in value)
                {
                    console.log(`${key} => ${value[key]}`);
                }
            }
        }

        if (this.mImage && this.mImage.value)
        {
            const file = this.mImage.value;
        
            console.log(`image => ${this.mImage.value}`);

            for (const key in file)
                console.log(`${key} => ${file[key]}`);
        }
    }
}

export { InputOperator };