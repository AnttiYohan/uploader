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
     * Initiates a read to the cache, 
     * -----------------------------
     * if not
     * found, performs a HTTP GET Request
     * 
     * @param  {string}  route 
     * @param  {object}  params
     * @param  {boolean} useToken
     * @return {Promise} response 
     */
    static getCachedWithParams(route, params, useToken = true)
    {
        let serialized = null;

        try {
         
            serialized = localStorage.getItem(route);
        
        } catch (error) {}

        console.log(`getCached: cache = ${serialized}`);

        if ( ! serialized )
        {
            console.log(`Cache was empty, HTTP request initiated`);
            return FileCache.getRequestWithTokenAndParams(route, params);
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
    static async getRequest(route, useToken = true, useStore = true)
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

        if (useStore)
        {
            try {

            localStorage.setItem(route, text);

            } catch (error){}
        }

        return text;

    }

    /**
     * Performs a HTTP GET Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route 
     * @return {Promise} response
     */
    static async getRequestWithToken(route, useStore = true)
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

        if (useStore)
        {
            try {

                localStorage.setItem(route, text);
                console.log(`Cache written - route ${route}, cahce: ${text}`);

            } catch (error){}
        }



        return text;
    }

        /**
     * Performs a HTTP GET Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route 
     * @return {Promise} response
     */
    static async getRequestWithTokenAndParams(route, params, useStore = true)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        console.log(`Authorization: ${bearer}`);
       
        let path = '';
        
        for (let key in params)
        {
            path += `/${params[key]}`;
        }

        console.log(`getRequest Params path: ${path}`);

        const response = await fetch
        (
            route + path,
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

        if (useStore)
        {
            try {

                localStorage.setItem(route, text);
                console.log(`Cache written - route ${route}, cahce: ${text}`);

            } catch (error){}
        }

        return text;
    }

    // ------------------------------------------------
    // -
    // - POST -- Write methods
    // -
    // ------------------------------------------------

    /**
     * Performs a HTTP POST Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {object}  dto
     * @param  {File}    imageFile 
     * @return {Promise} response
     */
    static async postDtoAndImage(route, dto, imageFile)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        console.log(`HTTP POST Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const 
        formData = new FormData();
        formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
        formData.append('image', imageFile);

        const response = await fetch
        (
            route,
            {
                method: 'POST',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: formData
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

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

        return text;
    }

}

export { FileCache }