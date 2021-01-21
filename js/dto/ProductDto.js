/**
 * Product Data Transfer Object Class
 */
class ProductDto
{
    constructor(id, name, amount, measureUnit, category)
    {
        this.id              = id;
        this.name            = name;
        this.amount          = amount;
        this.measureUnit     = measureUnit;
        this.productCategory = category;
    }
}

export { ProductDto }