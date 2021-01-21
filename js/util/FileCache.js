class FileCache
{
    /**
     * Storea a general token to local storage
     * 
     * @param {string} token 
     */
    static setToken(token)
    {
        localStorage.setItem('fc__token', token);
        console.log(`FileCache::setToken ${token}`);
    }

    /**
     * Returns the token or an empty string
     * 
     * @return {string} token
     */
    static getToken()
    {
        let result  = '';
        const token = localStorage.getItem('fc__token');

        if (token) result = token;

        console.log(`FileCache::getToken ${result}`);
        return result;
    }

    static clearToken()
    {
        localStorage.removeItem('fc__token');
    }

    static clearCache(route)
    {
        try {

            localStorage.removeItem(route);

        } catch (error) {}
    }

    // ------------------------------------------------
    // -
    // - GET -- Read methods
    // -
    // ------------------------------------------------

    /**
     * Initiates a read to the cache, if not
     * found, performs a HTTP GET Request
     * 
     * @param  {string}  route 
     * @param  {boolean} useToken
     * @return {Promise} response 
     */
    static getCached(route, useToken = true)
    {
        let serialized = null;

        try {
         
            serialized = localStorage.getItem(route);
        
        } catch (error) {}

        console.log(`getCached: cache = ${serialized}`);

        if ( ! serialized )
        {
            console.log(`Cache was empty, HTTP request initiated`);
            return FileCache.getRequest(route, useToken);
        }

        console.log(`Cache found, return from local store`);
        return Promise.resolve(serialized);
    }

    /**
     * Performs a HTTP GET Request
     * with or without Authorization headers and bearer token
     * 
     * @param  {string}  route 
     * @param  {boolean} useToken
     * @return {Promise} response
     */
    static async getRequest(route, useToken = true)
    {
        console.log(`getRequest - route ${route}, use token: ${useToken}`);

        if ( useToken )
        {
            return FileCache.getRequestWithToken(route);
        }

        const response = await fetch
        (
            route,
            {
                method: 'GET',
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Write cache
        // -----------------------------------

        try {

            localStorage.setItem(route, text);

        } catch (error){}
        return text;

    }

    /**
     * Performs a HTTP GET Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route 
     * @return {Promise} response
     */
    static async getRequestWithToken(route)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        console.log(`Authorization: ${bearer}`);
       
        const response = await fetch
        (
            route,
            {
                method: 'GET',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                }
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Write cache
        // -----------------------------------

        localStorage.setItem(route, text);
        console.log(`Cache written - route ${route}, cahce: ${text}`);

        return text;
    }

    // ------------------------------------------------
    // -
    // - DELETE -- Removal methods
    // -
    // ------------------------------------------------

    /**
     * Performs a HTTP DELETE Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {integer} id
     * @return {Promise} response
     */
    static async delete(route, id)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        console.log(`HTTP DELETE Authorization: ${bearer}`);

        const response = await fetch
        (
            `${route}/${id}`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                }
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);
        console.log(`Cache cleared - route ${route}`);

        return text;
    }

}

export { FileCache }