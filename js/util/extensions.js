
Object.defineProperty(Array.prototype, 'reversion',
{
    writable: false,
    enumerable: false,
    configurable: false,
    value: function (f)
    {
        let i;
        const length = this.length - 1;
        for (i = length; i >= 0; i--)
        {
            f( this[i], i, this );
        }
    }
});