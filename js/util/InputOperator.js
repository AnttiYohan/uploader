

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
         * @type {Array}
         */
        this.mStore = [];

        /**
         * Special property for main image input
         * ------------
         * @type {File}
         */
        this.mImage = undefined;

        /**
         * The root of editor components
         * ---------
         * @type {HTMLElement}
         */
        this.mComponentFrame = undefined;

        /**
         * Holds all editor components
         * ---------
         * @type {Array}
         */
        this.mComponentStore = [];
        this.mComponentMap = {};

        /**
         * Holds the dto for editor
         */
        this.mComponentValueMap = {};

        /**
         * Holds the available product list
         * @type {Array}
         */
        this.mAvailableProducts = [];

        if (Array.isArray(inputArray)) this.load(inputArray);
    }

    getInput(name)
    {
        return this.mStore.find(elem => elem.dataset.input === name);
    }

    getValue(name)
    {
        const  input = this.getInput(name);
        return input ? input.value : undefined;
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

    processInputs(stringify = true, embed = undefined)
    {
        const obj = {};
        let   success = true;

        console.log(`InputOperator::processInputs()`);

        if ( embed && typeof(embed) === 'object')
        {
            const key = Object.keys(embed)[0];
            obj[key] = embed[key];
        }

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
                const entry = Object.entries(result)[0];
                obj[entry[0]] = entry[1];
            }
        });

        console.log(`Success ${success}, read image element`);

        const image = this.imageFile();

        if ( ! image ) 
        {
            this.mImage.notifyRequired();
            console.log(`Image file not set`);
            success = false;
        }

        console.log(`Success after image elem: ${success}`);

        if ( success )
        {
            if (stringify)
            {
                const data = JSON.stringify(obj);
                console.log(`data: ${data}`);
                return { title: this.mKey, data };
            }

            console.log(`data: ${JSON.stringify(obj)}`);
            return { title: this.mKey, data: obj };
        }
        
        return undefined;
    }
    
    /**
     * 
     * @return {File|null}
     */
    imageFile()
    {
        try   { return this.mImage.value; }
        catch (error) {}

        return undefined;
    }

    reset()
    {
        this.mImage.reset();
        console.log(`Image inpu reset, iterate others`);
        this.mStore.forEach(element => 
            {
                console.log(`IO: element ${element.localName}`);
                element.reset();
            });
    }

    notifyRequired()
    {
        this.mImage.notifyRequired();
        this.mStore.forEach(element =>
            {
                element.notifyRequired()
            });
    }

    /**
     * Stores the data-input-frame, the parent of
     * component elements, into a member, and
     * begin to listen for component-connect events,
     * in order to know, when the component has
     * connected to the DOM and to perform further
     * initialization;
     * ------
     * @param {HTMLElement} frame 
     */
    setComponentFrame( frame )
    {
        this.mComponentFrame = frame;
        this.mComponentFrame.addEventListener
        ('component-connected', e => 
        {
            const label = e.detail.label;

            console.log(`InputOperator: component-connect received. Label: ${label}`);

            this.fillComponent( label );

        }, true);
    }

    /**
     * Push the editor component array, dto and available
     * products into the inputOperator.
     * This is done at editor initialization phase
     * -------
     * @param  {array}  components 
     * @param  {object} dto 
     * @param  {array}  availableProducts 
     */
    loadComponents( components, dto, availableProducts )
    {
        if ( ! Array.isArray( components ) ) return;

        /**
         * Store dto, available products into
         * InputOperator instance memory
         */
        this.mRecipeId = dto.id;
        this.mComponentValueMap = dto;
        this.mAvailableProducts = availableProducts;

        /**
         * Iterate though component nodes,
         * Look for data-label element, and its label value.
         * Store the component into component map,
         * using the label value as the key.
         * -----
         * In case the label value is
         * 'products' or 'stepBySteps',
         * store the component in an exclusive member,
         * in order to have direct access into those components
         */
        for( const component of components )
        {
            const labelElement = component.querySelector('[data-label]');
            if ( ! labelElement ) continue;
            
            const label = labelElement.dataset.label;
            if ( ! label ) continue;

            if ( label === 'products' )
            {
                this.mProductComponent = component;
            }
            else
            if ( label === 'stepBySteps' )
            {
                this.mStepComponent = component;
            }

            this.mComponentMap[label] = component;
            this.mComponentStore.push( component );
        }
    }

    loadProductComponent( productComponent )
    {

    }

    getUpdateImage()
    {
        let image;

        const component = this.mComponentMap['image'];
        const fieldSet = component.querySelector('[data-input]');

        if ( fieldSet )
        {
            image = fieldSet.value;
        }

        return image;
    }

    getUpdateRecipe(originals = false)
    {
        const dto = this.getUpdateRecipeDto(originals);
        return Object.keys(dto).length > 1
             ? JSON.stringify(dto)
             : '';
    }

    getUpdateRecipeDto(originals = false)
    {
        const resultSet = {};

        /**
         * Add id
         */
        resultSet['id'] = this.mRecipeId;

        /**
         * Add components
         */
        for (const key in this.mComponentMap)
        {
            if ( key === 'image' || key === 'products' || key === 'stepBySteps') continue;

            const component = this.mComponentMap[key];
            const editor = component.querySelector('[data-input]');

            if ( editor )
            {
                const value = editor.value;
                if ( value ) resultSet[key] = value;
                else {
                    if (originals)
                    {
                        const labelElement = component.querySelector('[data-label]');
                        const labelValue = labelElement.value;

                        resultSet[key] = labelValue;
                    }
                }
                
            }
        }

        return resultSet;
    }

    getUpdateProductListDto()
    {
        /**
         * Add components
         */
        const component = this.mProductComponent;
        const editor = component.querySelector('[data-input]');
        let products = undefined;

        if ( editor ) 
        {
            products = editor.value; 
        
            console.log(`Product amount: ${products.length}`);
            for ( const product of products )
            {
                console.log(`Product: ${product}, recipe id: ${product.recipeId}`);
                product.recipeId = this.mRecipeId;
            }
        }

        return products.length 
             ? JSON.stringify(products)
             : '';
    }

    /**
     * Returns a specifinc dataset for step contents and
     * a list of associated images
     * -------
     * @return {object} dto
     */
    getUpdateStepListDto()
    {
        /**
         * Add components
         */
        const component = this.mStepComponent;
        const editor = component.querySelector('[data-input]');
        let steps = {
            dto: {
                title: 'steps',
                data: ''
            },
            images: {
                title: 'images',
                data: []
            }
        };

        if ( editor ) 
        {
            const list = editor.value; 
            const dtoList = [];
            console.log(`Step amount: ${list.length}`);

            for ( const step of list )
            {
                console.log(`Step: ${step}, recipe id: ${step.text}`);
                dtoList.push({
                    text: step.text,
                    stepNumber: step.stepNumber,
                    recipeId: this.mRecipeId
                });

                steps.images.data.push(step.image);
            }

            steps.dto.data = JSON.stringify(dtoList);
        }

        return steps;
    }

    /**
     * Adds content into the components
     * ------
     * @param {string} label 
     */
    fillComponent( label )
    {
        const component = this.mComponentMap[label];
        const value = this.mComponentValueMap[label];

        /**
         * Check for special cases:
         * - products
         * - stepBySteps
         * - mealTypes
         * - seasons
         * - tips
         */
         switch (label) 
         {
             case 'products':
                 
                this.initProductMenu( component, value );
                break;
         
            case 'stepBySteps':

                this.initStepEditor( component, value );
                break;

            case 'mealTypes':

                this.initBinarySwitchGroup( component, value );
                break;

            case 'season':

                this.initBinarySwitchGroup( component, value );
                break;

            default:
                break;
         }
 
        if ( component )
        {
            const labelElement = component.querySelector('[data-label]');

            if ( labelElement ) {
                console.log(`Label elem: ${labelElement}, value: ${value}`);
                labelElement.addContent( value );
            }
        }
    }

    reloadComponent( label, value )
    {
        console.log(`Reload component ${label}`);

        /**
         * Exclude products and steps
         */
        if ( label === 'products' || label === 'stepBySteps' ) return;

        const component = this.mComponentMap[label];
    
        if ( component )
        {
            const labelElement = component.querySelector('[data-label]');

            labelElement.reset();
            labelElement.addContent( value );
            //const label = labelElement.dataset.label;
            //component.addContent( value );
        }
    }
    
    reloadEditor( recipe )
    {
        for ( const key in recipe )
        {
            this.reloadComponent( key, recipe[key] );
        }
    }
    /**
     * Fills the editor component collection with values
     * given in recipe DTO
     * ------
     * @param {RecipeDto} dto 
     */
    fillEditor( dto )
    {
        for ( const component of this.mComponentStore )
        {
            /**
             * Parse the label from the component
             */
            const labelElement = component.querySelector('[data-label]');
            const label = labelElement.dataset.label;
            console.log(`LabelElement label: ${label}, dto: ${dto[label]}`);

            /**
             * Set value into the labelElement
             */
            labelElement.addContent( dto[label] );
            //labelElement.value = this.getValue( label );
        }
    }
    
    initProductMenu( component, products )
    {

        /**
         * Listen for ingredient menu connected event,
         * and pass the availabale products into it
         */
         component.addEventListener('product-row-connected', e => 
         {
             console.log(`InputOperator::initProductMenu: product-row-connected`);
      
            /**
             * The product row
             */
            const row = component.querySelector('product-row');

            if ( row ) for ( const product of products )
            {
                row.addField( product, true );
            }

        });
        /**
         * Listen for ingredient menu connected event,
         * and pass the availabale products into it
         */
        component.addEventListener('ingredient-menu-connected', e => 
        {
            console.log(`InputOperator::initProductMenu: ingredient-menu-connected`);

            /**
             * Fill the menu with all available products
             */
            const menu = component.querySelector('ingredient-menu');

            if ( menu ) menu.pushDataSet( this.mAvailableProducts );
        
        });


    }

    /**
     * Resets and loads products into the product menu
     * 
     * @param {array} products 
     */
    reloadProductMenu( products )
    {
        const component = this.mProductComponent;

        /**
         * Parse the label from the component
         */
        const labelElement = component.querySelector('[data-label]');
        
        if ( labelElement )
        {
            labelElement.reset();
            labelElement.addContent( products );
        }
         
        /**
         * The product row
         */
        const row = component.querySelector('product-row');

        if ( row ) {

            row.reset();

            for ( const product of products )
            {
                row.addField( product, true );
            } 
        } 
    }

    initStepEditor( component, steps )
    {

        /**
         * Listen for ingredient menu connected event,
         * and pass the availabale products into it
         */
         component.addEventListener('step-editor-connected', e => 
         {
             console.log(`InputOperator::initProductMenu: step-editor-connected`);
      
            /**
             * The product row
             */
            const editor = component.querySelector('step-editor');

            if ( editor ) for ( const step of steps )
            {
                editor.addField( step );
            }
        });
    }

    initBinarySwitchGroup( component, binarySwitchList )
    {
        /**
         * Listen for ingredient menu connected event,
         * and pass the availabale products into it
         */
         component.addEventListener('binary-switch-group-connected', e => 
         {
             console.log(`InputOperator::initBinarySwitchGroup: binary-switch-group-connected`);
      
            /**
             * The Binary Switch Group
             */
            const group = component.querySelector('binary-switch-group');

            if ( group ) //for ( const binarySwitch of binarySwitchList )
            {
                group.pushDataSet( binarySwitchList );
            }
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