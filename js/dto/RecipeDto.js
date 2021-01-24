
/**
 * Recipe Data Transfer Object Class
 */
class RecipeDto
{
    constructor
    (
        pTitle,
        pInstructions,
        pFingerFood
    )
    {
        this.title = pTitle;
        this.instructions = pInstructions;
        this.season = pSeason;

        this.products = [];
    }

    /**
     * 
     * @param {ProductDto} productDto 
     */
    addProduct(productDto)
    {
        this.products.push(prodcutDto);
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

export { RecipeDto }