import ProductDto from './ProductDto.js';

/**
 * Recipe Data Transfer Object Class
 */
export class RecipeDto
{
    constructor(name, season, mealTypes, hasGluten, hasEgg)
    {
        this.mProducts  = [];

        this.mName      = name;
        this.mSeason    = season;
    
        // -----------------------------
        // - Create array of mealtype
        // - objects
        // -----------------------------

        if (Array.isArray(mealTypes)) for (const mealType of mealTypes)
        {
            this.mMealTypes.push({name: mealType});
        }

        // -----------------------------
        // - Boolean properties
        // -----------------------------

        this.mHasGluten = hasGluten;
        this.mHasEgg    = hasEgg;
    }

    /**
     * 
     * @param {ProductDto} productDto 
     */
    addProduct(productDto)
    {
        this.mProducts.push(prodcutDto);
    }

    get name()
    {
        return this.mName;
    }

    get season()
    {
        return this.mSeason;
    }

    get hasEgg()    { return this.mHasEgg;    }
    get hasGluten() { return this.mHasGluten; }
    get products()
    {
        return this.mProducts;
    }

    get productAmount()
    {
        return this.products.length;
    }

}