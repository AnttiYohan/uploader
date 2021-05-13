

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
    constructor(inputArray = [], options = {})
    {
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

        return null;
    }

    reset()
    {
        this.mImage.reset();
        this.mStore.forEach(element => element.reset());
    }

    notifyRequired()
    {
        this.mImage.notifyRequired();
        this.mStore.forEach(element => element.notifyRequired());
    }
}

export { InputOperator };