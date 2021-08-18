import { ResponseNotifier } from "../ResponseNotifier.js";

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

        return Promise.resolve({ ok: true, status: 200, text: serialized });
        //return Promise.resolve(serialized);
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

        return Promise.resolve({ ok: true, status: 200, text: serialized });
        //return Promise.resolve(serialized);
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
            return FileCache.getRequestWithToken(route, useStore);
        }

        const response = await fetch
        (
            route,
            {
                method: 'GET',
            }
        );

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        const text = await response.text();

        // -----------------------------------
        // - Write cache, when ok
        // -----------------------------------

        if ( useStore && ok )
        {
            try {

            localStorage.setItem( route, text );

            } catch (error){}
        }

        return { ok, status, text };
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
        const bearer   = `Bearer ${FileCache.getToken()}`;
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

        const status = response.status;
        const ok     = response.ok;
        const text   = await response.text();

        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        // -----------------------------------
        // - Write cache, when ok
        // -----------------------------------

        if ( useStore && ok )
        {
            try {

            localStorage.setItem( route, text );

            } catch (error){}
        }

        return { ok, status, text };
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
        
        for ( const key in params )
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

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);

        const text = await response.text();

        // -----------------------------------
        // - Write cache
        // -----------------------------------

        if ( useStore && ok )
        {
            try {

                localStorage.setItem(route, text);
                console.log(`Cache written - route ${route}, cahce: ${text}`);

            } catch (error){}
        }

        return { ok, status, text };
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
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: formData
            }
        );

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, status, text };
    }

    /**
     * Performs a HTTP POST Request, includes an 
     * Authorization header with bearer and token from storage
     * Return the promise
     * 
     * @param  {string}       route
     * @param  {object}       dto
     * @param  {Array<File>}  media 
     * @return {Promise}      response
     */
     static postDtoAndMedia(route, dto, media)
     {
        const bearer = `Bearer ${FileCache.getToken()}`;
 
        console.log(`postDtoAndMedia: HTTP POST Authorization: ${bearer}`);
 
        // -----------------------------------
        // - Clear route cache
        // -----------------------------------
 
        FileCache.clearCache(route);
 
        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------
 
        const 
        formData = new FormData();
        formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
         
        for ( const unit of media )
        {
            formData.append( 'images', unit.image, `${unit.size}` );   
        }
  
        return fetch
        (
            route,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: 
                {
                     'Authorization' : bearer,
                },
                body: formData
            }
        );
     }
  /**
     * Performs a HTTP POST Multipart Request
     * contains main json part and image part,
     * then children as an array of json objects,
     * and a list of image parts
     * Includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}    route
     * @param  {object}    dto
     * @param  {File}      imageFile 
     * @param  {object}    childrenDto
     * @param  {object}    childrenImageDto
     * @return {Promise}   response
     */
   static async postDtoAndImageWithChildren(route, dto, imageFile, childrenDto, childrenImageDto)
   {
       const bearer = `Bearer ${FileCache.getToken()}`;

       // ------------------------------------
       // - Generate multipart payload
       // ------------------------------------

       const 
       formData = new FormData();
       formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
       formData.append('image', imageFile);

       // ---------------------------------------
       // - Children objects embedded in one part
       // - As an array of objects
       // ---------------------------------------

       formData.append(childrenDto.title, new Blob([childrenDto.data],{type:'application/json'}));

       // ---------------------------------------
       // - Parse the child images
       // ---------------------------------------

       const childImageTitle = childrenImageDto.title;

       for (const image of childrenImageDto.images)
       {
            formData.append(childImageTitle, image);
       }

       const response = await fetch
       (
           route,
           {
               method: 'POST',
               mode: 'cors',
               cache: 'no-cache',
               credentials: 'include',
               headers: 
               {
                   'Authorization' : bearer
               },
               body: formData
           }
       );

       const status = response.status;
       const ok = response.ok;
       console.log(`FileCache::response ok ${ok} status ${status}`);
    
       const text = await response.text();

       // -----------------------------------
       // - Clear route cache
       // -----------------------------------

       FileCache.clearCache(route);

       return { ok, status, text };
   }


    // ------------------------------------------------
    // -
    // - PUT/PATCH -- Update methods
    // -
    // ------------------------------------------------

    /**
     * Performs a HTTP PUT Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  dto
     * @return {Promise} response
     */
    static async putDto(route, dto)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        // ------------------------------------
        // - No need for multipart
        // ------------------------------------
        
        const response = await fetch
        (
            route,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer,
                    'Content-Type': 'application/json'
                },
                body: dto
            }
        );

        const status = response.status;
        const ok     = response.ok;
        const text   = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, status, text };
    }

    /**
     * Performs a HTTP PUT Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {object}  dto
     * @param  {File}    imageFile 
     * @return {Promise} response
     */
    static async putDtoAndImage(route, dto, imageFile)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;

        console.log(`HTTP PUT Authorization: ${bearer}`);

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
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: formData
            }
        );

        const status = response.status;
        const ok     = response.ok;
        const text   = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, status, text };
    }

    /**
     * Performs a HTTP PUT Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}         route
     * @param  {object}         dto
     * @param  {Array<File>}    images 
     * @return {Promise} response
     */
    static async putDtoAndImageList(route, dto, images)
    {
     const bearer = `Bearer ${FileCache.getToken()}`;

     console.log(`HTTP PUT Authorization: ${bearer}`);

     // ------------------------------------
     // - Generate multipart payload
     // ------------------------------------

     const 
     formData = new FormData();
     formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
    
    // ---------------------------------------
    // - Parse the image list
    // ---------------------------------------

    const imageTitle = images.title;

    for (const image of images.data)
    {
        formData.append(imageTitle, image);
    }

     const response = await fetch
     (
         route,
         {
             method: 'PUT',
             mode: 'cors',
             cache: 'no-cache',
             credentials: 'include',
             headers: 
             {
                 'Authorization' : bearer
             },
             body: formData
         }
     );

     const status = response.status;
     const ok     = response.ok;
     const text   = await response.text();

     // -----------------------------------
     // - Clear route cache
     // -----------------------------------

     FileCache.clearCache(route);

     return { ok, status, text };
 }


    /**
     * Performs a HTTP PUT Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  dto
     * @return {Promise} response
     */
 static async patchDto(route, dtoKey, dto, idKey, idValue)
 {
     const bearer = `Bearer ${FileCache.getToken()}`;

     console.log(`HTTP PATCH Authorization: ${bearer}`);

     // ------------------------------------
     // - No need for multipart
     // ------------------------------------

     const 
     formData = new FormData();
     formData.append( dtoKey, new Blob([dto],{type:'application/json'}) );
     formData.append( idKey, `${idValue}`);
     
     const response = await fetch
     (
         route,
         {
             method: 'PATCH',
             credentials: 'include',
             headers: 
             {
                 'Authorization' : bearer
             },
             body: formData
         }
     );

     const status = response.status;
     const ok     = response.ok;
     const text   = await response.text();

     // -----------------------------------
     // - Clear route cache
     // -----------------------------------

     FileCache.clearCache(route);

     return { ok, status, text };
 }

    /**
     * Performs an HTTP PATCH Request, 
     * ------------------------------
     * which updates a field with mixed type value
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}   route
     * @param  {string}   endpoint
     * @param  {string}   fieldKey
     * @param  {mixed}    fieldValue
     * @param  {string}   idKey
     * @param  {number}   idValue
     * @return {Promise}  response
     */
    static async patchFieldById(route, endpoint, fieldKey, fieldValue, idKey, idValue)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PATCH Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const 
        formData = new FormData();
        formData.append(fieldKey, fieldValue);
        formData.append(idKey, idValue);

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: formData
            }
        );

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, status, text };
    }

    /**
     * Performs an HTTP PATCH Request, 
     * ------------------------------
     * which updates a field with type of `boolean`
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  endpoint
     * @param  {string}  fieldKey
     * @param  {boolean} fieldValue
     * @param  {string}  idKey
     * @param  {number}  idValue
     * @return {Promise} response
     */
    static async patchBooleanById(route, endpoint, fieldKey, fieldValue, idKey, idValue)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PATCH Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const 
        formData = new FormData();
        formData.append(fieldKey, fieldValue);
        formData.append(idKey, idValue);

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: formData
            }
        );

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, staus, text };
    }


    /**
     * Performs an HTTP PATCH Request, 
     * ------------------------------
     * with multipart formdata, compiled from an object
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  endpoint
     * @param  {object}  parts
     * @return {Promise} response
     */
    static async patchMultiPart(route, endpoint, parts)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PATCH Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const formData = new FormData();

        for (let key in parts)
        {
            formData.append(key, parts[key]);
            //formData.append(key,  new Blob([parts[key]],{type:'text/plain'}));
        }

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PATCH',
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

    /**
     * Performs an HTTP PATCH Request, 
     * ------------------------------
     * which updates a field with type of `string`
     * params:
     * 1) base route
     * 2) route endpoint
     * 3) payload as JS Object key/value pairs
     *                     
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  baseroute
     * @param  {string}  endpoint
     * @param  {object}  payload
     * @return {Promise} response
     */
    static async patchJSON(route, endpoint, payload)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PATCH 'JSON' Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return text;
    }


    /**
     * Performs an HTTP PUT Request, 
     * ------------------------------
     * with a payload of a serialized JSON object (multiple key/value pairs)
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  path
     * @param  {object}  payload
     * @return {Promise} response
     */
    static async putJSON(route, endpoint, payload)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PUT Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate Request
        // ------------------------------------

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: 
                {
                    'Authorization' : bearer
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return text;
    }

    /**
     * Performs a HTTP PATHC Request, includes an 
     * Authorization header with bearer and token from storage
     * 
     * @param  {string}  route
     * @param  {string}  endpoint
     * @param  {string}  imageKey
     * @param  {File}    imageFile
     * @param  {string}  idKey
     * @param  {integer} idValue 
     * @return {Promise} response
     */
    static async patchImageById(route, endpoint, imageKey, imageFile, idKey, idValue)
    {
        const bearer = `Bearer ${FileCache.getToken()}`;
        console.log(`HTTP PATCH Authorization: ${bearer}`);

        // ------------------------------------
        // - Generate multipart payload
        // ------------------------------------

        const 
        formData = new FormData();
        formData.append(idKey, idValue);
        formData.append(imageKey, imageFile);

        const response = await fetch
        (
            `${route}/${endpoint}`,
            {
                method: 'PATCH',
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

        const status = response.status;
        const ok = response.ok;
        console.log(`FileCache::response ok ${ok} status ${status}`);
     
        const text = await response.text();

        // -----------------------------------
        // - Clear route cache
        // -----------------------------------

        FileCache.clearCache(route);

        return { ok, status, text };
    }

    // -------------------------------------------------
    // -
    // - Upload methods with progress events
    // - POST -- upload*,
    // - PUT  -- update*
    // -------------------------------------------------

    /**
     * Performs an HTTP POST Request with XMLHttpRequest object, 
     * The request is multipart, the parts:
     * - serialized json dto, param 'dto'
     * - image file, param 'imageFile'
     * 
     * @param  {string}  route
     * @param  {object}  dto
     * @param  {File}    imageFile
     * @param  {Map}     eventHandlerMap 
     * @return {Promise} response
     */
    static async uploadDtoAndImage( route, dto, imageFile, responseNotifier )
    {
        return new Promise( ( resolve, reject ) => {

            const bearer = `Bearer ${FileCache.getToken()}`;

            /**
             * Generate the multipart payload
             */
            const 
            formData = new FormData();
            formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
            formData.append('image', imageFile);

            /**
             * Generate the xhr
             */
            const xhr = FileCache.createXhr
            ( 
                route,
                responseNotifier,
                bearer,
                resolve,
                reject
            );

            /**
             * Execute the request and invalidate route cache
             */
            xhr.send( formData );
            FileCache.clearCache(route);
        });
    }



    /**
     * Performs an HTTP POST Request with XMLHttpRequest object, 
     * The request is multipart, the parts:
     * - serialized json dto, param 'dto'
     * - image file, param 'imageFile'
     * 
     * @param  {string}  route
     * @param  {object}  dto
     * @param  {File}    imageFile
     * @param  {object}  childrenDto
     * @param  {object}  childrenImageDto
     * @param  {Map}     eventHandlerMap 
     * @return {Promise} response
     */
    static async uploadDtoAndImageWithChildren
    ( 
        route, 
        dto, 
        imageFile, 
        childrenDto, 
        childrenImageDto,
        responseNotifier 
    )
    {
        return new Promise( ( resolve, reject ) => {

            const bearer = `Bearer ${FileCache.getToken()}`;

            /**
             * Generate the multipart payload
             * with four main categories:
             * - main dto
             * - main image file associated with main dto
             * - multiple related child dtos
             * - multiple image files associated with child dtos
             */
            const 
            formData = new FormData();
            formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
            formData.append('image', imageFile); 
            formData.append(childrenDto.title, new Blob([childrenDto.data],{type:'application/json'}));
        
            for (const image of childrenImageDto.images)
            {
                 formData.append(childrenImageDto.title, image);
            }
     
            /**
             * Generate the xhr
             */
            const xhr = FileCache.createXhr
            ( 
                route,
                responseNotifier,
                bearer,
                resolve,
                reject
            );

            /**
             * Execute the request and invalidate route cache
             */
            xhr.send( formData );
            FileCache.clearCache(route);
        });
    }

    /**
     * Performs an HTTP PUT Request with XMLHttpRequest object, 
     * The request is multipart, the parts:
     * - serialized json dto, param 'dto'
     * - image file list, param 'images'
     * 
     * @param  {string}             route
     * @param  {object}             dto
     * @param  {object}             images
     * @param  {ResponseNotifier}   responseNotifier 
     * @return {Promise}            response
     */
    static async updateDtoAndImageList( route, dto, images, responseNotifier )
    {
        return new Promise( ( resolve, reject ) => {

            const bearer = `Bearer ${FileCache.getToken()}`;

            /**
             * Generate the payload:
             * - dto
             * - images
             */
            const 
            formData = new FormData();
            formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
        
            for (const image of images.data)
            {
                formData.append(images.title, image);
            }

            /**
             * Generate the xhr
             */
            const xhr = FileCache.createXhr
            ( 
                route,
                responseNotifier,
                bearer,
                resolve,
                reject,
                'put'
            );

            /**
             * Execute the request and invalidate route cache
             */
            xhr.send( formData );
            FileCache.clearCache(route);
        });
    }
 
     /**
      * Performs an HTTP PUT Request with XMLHttpRequest object, 
      * The request sends an serailized json object string as its
      * payload
      * 
      * @param  {string}             route
      * @param  {string}             serial
      * @param  {ResponseNotifier}   responseNotifier 
      * @return {Promise}            response
      */
    static async updateDto( route, serial, responseNotifier )
    {
        return new Promise( ( resolve, reject ) => {

            const bearer = `Bearer ${FileCache.getToken()}`;

            /**
             * Generate the xhr
             */
            const xhr = FileCache.createXhr
            ( 
                route,
                responseNotifier,
                bearer,
                resolve,
                reject,
                'put'
            );

            /**
             * Execute the request and invalidate route cache
             */
            xhr.send( serial );
            FileCache.clearCache(route);
        });
    }
 
    /**
     * Performs an HTTP PUT Request with XMLHttpRequest object, 
     * The request is multipart, the parts:
     * - serialized json dto, param 'dto'
     * - image file, param 'imageFile'
     * 
     * @param  {string}           route
     * @param  {object}           dto
     * @param  {File}             imageFile
     * @param  {ResponseNotifier} responseNotifier 
     * @return {Promise}          response
     */
    static async updateDtoAndImage( route, dto, imageFile, responseNotifier )
    {
        return new Promise( ( resolve, reject ) => {

            const bearer = `Bearer ${FileCache.getToken()}`;

            /**
             * Generate the multipart payload
             */
            const 
            formData = new FormData();
            formData.append(dto.title, new Blob([dto.data],{type:'application/json'}));
            formData.append('image', imageFile);

            /**
             * Generate the xhr
             */
            const xhr = FileCache.createXhr
            ( 
                route,
                responseNotifier,
                bearer,
                resolve,
                reject,
                'put'
            );

            /**
             * Execute the request and invalidate route cache
             */
            xhr.send( formData );
            FileCache.clearCache(route);
        });
    }
 
    /**
     * Generates an XHR with event handlers,
     * that invoke promise methods
     * 
     * @param  {string}                  route 
     * @param  {ResponseNotifier}        notifier 
     * @param  {string}                  bearer 
     * @param  {PromiseFulfilledResult}  resolve 
     * @param  {PromiseRejectedResult}   reject 
     * @param  {string}                  method
     * @param  {boolean}                 credentials
     * @return {XMLHttpRequest}
     */
    static createXhr( route, notifier, bearer, resolve, reject, method = 'post', credentials = true )
    {
        const xhr = new XMLHttpRequest();

        xhr.open( method, route );
        xhr.withCredentials = credentials;
        xhr.setRequestHeader( 'Authorization', bearer );
        xhr.upload.addEventListener( 'progress', e => notifier.progressHandler( e ) );
        xhr.addEventListener( 'load', e => 
        {
            resolve({

                'ok'    : xhr.status < 300 ? true : false,
                'status': xhr.status,
                'text'  : xhr.responseText,
                'size'  : e.total 

            });
        });

        xhr.addEventListener( 'error', e => 
        {
            reject({
                
                'text':   `error: ${xhr.statusText}`,
                'status': xhr.status

            });
        });

        xhr.upload.addEventListener( 'error', e => 
        {
            reject({
                
                'text':   `error: ${xhr.statusText}`,
                'status': xhr.status

            });
        });

        xhr.upload.addEventListener( 'abort', e => 
        {
            reject({
                
                'text'  : `Request aborted`,
                'loaded': e.loaded

            });
        });

        return xhr;
    }
}

export { FileCache }