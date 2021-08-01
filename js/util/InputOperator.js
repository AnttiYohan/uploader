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
         * Property for media, main image and thumbnails
         * ------------
         * @type Array<File>
         */
         this.mMedia = [];

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
            else if (element.localName === 'media-input-row')
            {
                this.setMediaInput(element);
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
     * Store the media input here
     */
    setMediaInput(element)
    {
        console.log(`Media input ${element.localName} stored`);
        this.mMedia = element;
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

    /**
     * Iterate through every input, store
     * the input key/value pairs.
     * 
     * Param 'serialize' controls whether the
     * result is returned as an object, or as 
     * a serialized string 
     * 
     * Param 'ember' is used to optionally embed
     * extra entries into the result set
     *  
     * @param  {boolean},      serialize flag
     * @param  {embed},        embedded entries 
     * @return {object|string} result set 
     */
    processInputs( serialize = true, embed = undefined )
    {
        const resultSet = {};
        let   success   = true;

        console.log(`InputOperator::processInputs()`);

        /**
         * Embed the embed object into the 'obj'
         */
        if ( embed && typeof( embed ) === 'object' )
        {
            for ( const key of Object.keys( embed ) )
            {
                resultSet[ key ] = embed[ key ];
            }
        }

        this.mStore.forEach( element => 
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
                const entry = Object.entries( result )[0];
                resultSet[ entry[0] ] = entry[1];
            }
        });

        console.log(`Success ${success}, read image element`);

        const image = this.imageFile();

        if ( ! image  ) 
        {
            this.mImage.notifyRequired();
            console.log(`Image not set`);
            success = false;
        }
        
        console.log(`Success after image elem: ${success}`);

        if ( success )
        {
            console.log(`data: ${JSON.stringify( resultSet )}`);
            const title = this.mKey;

            return serialize
                 ? { title, data: JSON.stringify( resultSet ) }
                 : { title, data: resultSet };

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

    /**
     * @return {array|undefined}
     */
    mediaList()
    {
        return this.mMedia.value;
    }

    reset()
    {
        if ( this.mImage ) this.mImage.reset();
        this.mStore.forEach( element => element.reset() );
    }

    notifyRequired()
    {
        this.mImage.notifyRequired();
        this.mStore.forEach( element => element.notifyRequired() );
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
        this.mDtoId = dto.id;
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
            if ( label === 'steps' )
            {
                this.mStepComponent = component;
            }

            this.mComponentMap[label] = component;
            this.mComponentStore.push( component );
        }
    }

    getUpdateImage()
    {
        let image;

        const component = this.mComponentMap['mediaDto'];
        const fieldSet = component.querySelector('[data-input]');

        if ( fieldSet )
        {
            image = fieldSet.value;
        }

        return image;
    }

    /**
     * Returns an entry value from the component map
     * 
     * @param  {string} key 
     * @return {any}
     */
    getEditorEntry( key )
    {
        let result = undefined;

        const component = this.mComponentMap[ key ];
        const editor = component.querySelector( '[data-input]' );
        if ( editor )
        {
            const value = editor.value;
            if ( value ) result = value;
            else
            if ( originals )
            {
                const labelElement = component.querySelector( '[data-label]' );
                result   = labelElement.value;
            }    
        }

        return result;
    }

    getEditorDto( originals = false )
    {
        const resultSet = {};

        /**
         * Add id
         */
        resultSet[ 'id' ] = this.mDtoId;

        /**
         * Add components
         */
        for ( const key in this.mComponentMap )
        {
            if ( key === 'mediaDto' || key === 'products' || key === 'steps' ) continue;

            const component = this.mComponentMap[ key ];
            const editor = component.querySelector( '[data-input]' );

            if ( editor )
            {
                const value = editor.value;
                if ( value ) resultSet[ key ] = value;
                else
                if ( originals )
                {
                    const labelElement = component.querySelector( '[data-label]' );
                    resultSet[ key ]   = labelElement.value;
                }    
            }
        }

        return resultSet;
    }


    getUpdateRecipe( originals = false )
    {
        const dto = this.getUpdateRecipeDto( originals );
        return Object.keys(dto).length > 1
             ? JSON.stringify(dto)
             : '';
    }

    getUpdateRecipeDto( originals = false )
    {
        const resultSet = {};

        /**
         * Add id
         */
        resultSet[ 'id' ] = this.mDtoId;

        /**
         * Add components
         */
        for (const key in this.mComponentMap)
        {
            if ( key === 'mediaDto' || key === 'products' || key === 'steps') continue;

            const component = this.mComponentMap[key];
            const editor = component.querySelector('[data-input]');

            if ( editor )
            {
                const value = editor.value;
                if ( value ) resultSet[key] = value;
                else
                if ( originals )
                {
                    const labelElement = component.querySelector('[data-label]');
                    const labelValue = labelElement.value;

                    resultSet[ key ] = labelValue;
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
                product.recipeId = this.mDtoId;
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
                    recipeId: this.mDtoId
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
        const component = this.mComponentMap[ label ];
        const value = this.mComponentValueMap[ label ];

        /**
         * Check for special cases:
         * - products
         * - stepBySteps
         * - mealTypes
         * - seasons
         * - tips
         */
        switch ( label ) 
        {
             case 'products':
                 
                this.initProductStore( component, value );
                break;
         
            case 'steps':

                this.loadStore( component, value, 'step-store' );
                break;

            case 'mealTypes':

                this.loadStore( component, value, 'binary-switch-group' );
                break;

            case 'season':

                this.loadStore( component, value, 'binary-switch-group' );
                break;

        }
 
        if ( component )
        {
            const labelElement = component.querySelector( '[data-label]' );

            if ( labelElement ) {
                console.log(`Label elem: ${labelElement}, value: ${value}`);
                labelElement.addContent( value );
            }
        }
    }

    reloadComponent( label, value )
    {
        console.log( `Reload component ${label}` );

        /**
         * Exclude products and steps
         */
        if ( label === 'products' || label === 'steps' ) return;

        const component = this.mComponentMap[ label ];
        if ( component )
        {
            const labelElement = component.querySelector( '[data-label]' );
            labelElement.reset();
            labelElement.addContent( value );

            const inputElement = component.querySelector( '[data-input]' );
            inputElement.reset();
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
        }
    }
    
    /**
     * Initial loading of a StoreComponent, wait for connected event
     * 
     * @param {EditorComponent} component 
     * @param {array}           set 
     * @param {string}          selector 
     * @param {string}          event 
     */
    loadStore( component, set, selector )
    {
        /**
         * Listen for param event,
         * and pass the availabale set into the component store
         */
        component.addEventListener( `${selector}-connected`, e => 
        {
            console.log( `InputOperator::loadStore: ${selector}`);

            /**
             * The StoreComponent
             */
            const store = component.querySelector( selector );
            if ( store )
            {
                store.pushDataSet( set );
            }
        });
    }

    /**
     * Reloading of a store component
     * 
     * @param {EditorComponent} component 
     * @param {array}           set 
     * @param {string}          selector 
     */
    reloadStore( component, set, selector )
    {
        /**
         * Editor label element
         */
        const labelElement = component.querySelector( '[data-label]' );
        if ( labelElement )
        {
            labelElement.reset();
            labelElement.addContent( set );
        }

        /**
         * StoreComponent
         */
        const store = component.querySelector( selector );
        if ( store ) 
        {
            store.pushDataSet( set );
        } 
    }

    initProductStore( component, products )
    {

        this.loadStore( component, products, 'product-store' );

        /**
         * Listen for ingredient menu connected event,
         * and pass the availabale products into it
         */
        component.addEventListener( 'ingredient-menu-connected', e => 
        {
            console.log(`InputOperator::initProductMenu: ingredient-menu-connected`);

            /**
             * Fill the menu with all available products
             */
            const menu = component.querySelector( 'ingredient-menu' );

            if ( menu ) menu.pushDataSet( this.mAvailableProducts );
        
        });


    }

    /**
     * Resets and loads products into the product menu
     * 
     * @param {array} products 
     */
    reloadProductStore( products )
    {
        this.reloadStore( this.mProductComponent, products, 'product-store' ); 
    }

    initStepStore( component, steps )
    {
        this.loadStore( component, steps, 'step-store' );
    }

    /**
     * Resets and loads products into the product menu
     * 
     * @param {array} steps 
     */
    reloadStepStore( steps )
    {
        this.reloadStore( this.mStepComponent, steps, 'step-store' ); 
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
            const group = component.querySelector( 'binary-switch-group' );
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