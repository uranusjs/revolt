import axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'node:events';
import { Bucket } from './ratelimiter/builder';
import { MethodRequest, Route } from './Route';

/**
 * This interface will inform you to establish the relief on the route and identify if it is full
 */
export interface RestActionRelieve {
  route: Route<any, any>;
  requestOptions: RequestOptions;
}

export interface RestActionI<R, T> {
  rest: RestClient;
  route: Route<R, T>;
  requestOptions: RequestOptions;
}


/**
 * Manage request actions to receive the response from the Revolt API.
 */
export class RestAction<Body, R, Metadata> extends EventEmitter {
    timeoutRequest?: number;
    private metadata?: Metadata;
    private route: Route<Body, R>;
    private rest: RestClient;
    private requestOptions: RequestOptions;

    constructor(rest: RestClient, route: Route<Body, R>, requestOptions: RequestOptions) {
        super();
        this.rest = rest;
        this.route = route;
        this.requestOptions = requestOptions;
    }

    setTimeoutRequest(timeout: number) {
        this.timeoutRequest = timeout;
        return this;
    }

    getMetadata() {
        if (this.metadata !== undefined) {
            return this.metadata;
        }
        return null
    }

  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
    queue(dataFunction: Promise<void> | Function | void | any) {
        const toRequest = async () => {
            this.requestOptions.queue = (d) => dataFunction(d);
            this.requestOptions.err = (e) => this.error(e);
            this.requestOptions.errStatusCode = (e) => this.errStatusCode(e);
            await this.rest.createRequest(this.route, this.requestOptions);
        }

        toRequest()
        return this;
    }

  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
    error(err: Promise<void> | Function | void | Error | any) {
        if (typeof err != 'function')
            return;
        if (err == undefined && err == null) return;

        this.requestOptions.err = (e: Error) => {
            if (e == undefined && e == null) return;
            err(e)
        }
        return;
    }

  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
    errStatusCode(err: Promise<void> | Function | void | any) {
        if (typeof err != 'function')
            return;
        if (err == undefined && err == null) return;

        this.requestOptions.errStatusCode = (e: number) => {
            if (e == undefined && e == null) return;
            err(e)
        }
        return;
    }


    static create<R, T, M>(options: RestActionI<R, T>) {
        return new RestAction<R, T, M>(options.rest, options.route, options.requestOptions);
    }
}

export enum API {
  PROTOCOL = 'https://',
  URL = 'api.revolt.chat',
}



export interface DetailsBucket {
  bucket: number;
  limit: number;
  remaining: number;
  resetAfter: number;
}


export interface RequestItem {
  rateLimit: boolean;
  requestRoute: Route<any, any>;
  requestOptions?: RequestOptions;
  requestPacket: RequestPacket;
}


export interface DataRequest {
  id: string;
  requestRoute: Route<any, any>;
  requestOptions?: RequestOptions;
  requestPacket: RequestPacket;
  // We can trace this route to find the bucket
  track?: boolean;
}


export interface StateRequest {
  id: number;
  b: Array<RequestItem>;

}


export interface HeadersDetailsI {
  'x-ratelimit-bucket': string;
  'x-ratelimit-limit': number;
  'x-ratelimit-remaining': number;
  'x-ratelimit-reset-after': number;
}

export class HeadersDetails {

    static validateBucket(headers: Record<string, string> & {
    "x-rateLimit-bucket"?: string[],
    "x-rateLimit-limit"?: string[],
    "x-rateLimit-remaining"?: string[],
    "x-rateLimit-reset-after"?: string[],
    "set-cookie"?: string[]
  }) {
        if (headers === undefined) {
            return false
        }
        if (headers['x-ratelimit-bucket'] === undefined) {
            return false
        }
        if (headers['x-ratelimit-limit'] === undefined) {
            return false
        }
        if (headers['x-ratelimit-remaining'] === undefined) {
            return false
        }
        if (headers['x-ratelimit-reset-after'] === undefined) {
            return false
        }
        return true
    }


    static getBucket(headers: Record<string, string> & {
    "set-cookie"?: string[]
  }) {
        return {
            "bucket": parseInt(headers['x-ratelimit-bucket']),
            "limit": parseInt(headers['x-ratelimit-limit']),
            "remaining": parseInt(headers['x-ratelimit-remaining']),
            "resetAfter": parseInt(headers['x-ratelimit-reset-after'])
        }
    }

}

/**
 * Requests first go through the bucket manager to avoid unnecessary request explosion
 */
export class BucketManager extends EventEmitter {
    sessionToken!: string;
    buckets: Map<string, Bucket>
    restClient?: RestClient;
    constructor(sessionToken: string, restClient: RestClient) {
        super()
        if (sessionToken !== undefined && typeof sessionToken === 'string') {
            this.sessionToken = sessionToken
        }
        if (restClient !== undefined) {
            this.restClient = restClient;
        }
        this.buckets = new Map()
    }

    createRequest(route: Route<any, any>, requestOptions: RequestOptions) {
        if (this.getRoute(route)?.bucket == undefined && this.getRoute(route)?.bucket == null) {
            this.registerBucketWithRoute(route)
        }
        if (!(this.restClient instanceof RestClient)) throw new Error('RestClient is invalid!');
        const requestPacket = new RequestPacket(this.sessionToken, this.restClient);

        if (this.getRoute(route) !== undefined) {
            if (this.getRoute(route).bucket !== undefined && this.getRoute(route).bucket !== null) {
                const bucket = this.getRoute(route).bucket

                if (bucket !== null) {
                    bucket.registerRequest(route, requestOptions, requestPacket, bucket.nextRequestCheck())
                }

            }

        }
    }


    private genHash() {
        const size = 300000000

        return (Math.floor(Math.random() * size)).toString(16) + (Math.floor(Math.random() * size)).toString(16) + (Math.floor(Math.random() * size)).toString(16)
    }

    registerBucketWithRoute(route: Route<any, any>) {
        const idHash = this.genHash()
        const bucket = new Bucket(idHash, this)

        bucket.setRoute(route)
        bucket.setBucketSettings(route)

        bucket.on('debugMessage', (d: any, msg: any) => {
            this.emit('debugRest', d, msg)
        })
        bucket.on('traceMessage', (d: any, msg: any) => {
            this.emit('traceRest', d, msg)
        })
        this.buckets.set(idHash, bucket)
        this.emit('debugRest', bucket, `New bucket is being cached. Your ID is: ${idHash}/${(route.method !== null && route.method !== undefined) ? route.method : 'MethodUnknown!'}`)
        return this
    }

    getRoute(route: Route<any, any>) {
        let bucket: Bucket | null = null
        let requestCreate: Route<any, any> | null = null

        for (const a of this.buckets) {
            if (this.buckets.get(a[0]) !== undefined) {
                bucket = a[1]
                if (this.buckets.get(bucket.id)?.getRoute() !== undefined) {
                    if (a[1].getRoute()?.path === route.path && a[1].getRoute()!.method) {
                        requestCreate = a[1].getRoute()!
                        break
                    }
                }
            }
        }
        return {
            bucket,
            requestCreate
        }
    }
}


export interface RestClientI {
  sessionToken: string;
  bucketManager?: BucketManager;
}


export class RestClient {
    sessionToken!: string;
    bucketManager?: BucketManager;
    constructor(restOptions: RestClientI) {
        if (restOptions !== undefined && restOptions !== null) {
            if (restOptions.sessionToken !== undefined) {
                this.sessionToken = restOptions.sessionToken
            } else {
                throw new Error("Missing sessionToken: RestClient(restOptions: {sessionToken? <-}).");
            }
            if (restOptions.bucketManager !== undefined) {
                this.bucketManager = restOptions.bucketManager;
            } else {
                this.bucketManager = new BucketManager(this.sessionToken, this)
            }
        }
    }


    createRequest<R, T>(route: Route<R, T>, requestOptions: RequestOptions) {
        if (this.bucketManager !== undefined) {
            return this.bucketManager.createRequest(route, requestOptions)
        } else {
            throw new Error('Missing bucket system!')
        }
    }
}

export interface RequestPacket {
  /**
   * This event only fires when there are no two properties returning global limitation and so much for the bucket. 
   * 
   * You only receive it when the requisition has been successfully prepared and sent.
   */
  on(event: 'ready', listener: any): this;
  on(event: 'bump', listener: any): this;
  /**
   * You can usually get a permission error or because the status code didn't return properly.
   */
  on(event: 'error', listener: any): this;
  on(event: 'rateLimitGlobal', listener: any): this;
  on(event: 'rateLimit', listener: any): this;
  /**
   * When the bucket is restored and has been chosen to execute this request.
   */
  on(event: 'restoredBucket', listener: any): this;
}

export class RequestPacket extends EventEmitter {
    sessionToken!: string;
    restClient: RestClient | undefined;
    constructor(sessionToken: string, restClient: RestClient) {
        super();
        if (sessionToken !== undefined && typeof sessionToken === 'string') {
            this.sessionToken = sessionToken
        }
        if (restClient !== undefined) {
            this.restClient = restClient
        }
    }

    build(route: Route<any, any>, requestOptions: RequestOptions) {
        return new RequestCreate(route, this, this.restClient!, this.sessionToken)
            .selectRequest(requestOptions)
    }
}

export interface RequestOptions {
  // JSON?
  body?: any;
  // Endpoint is JSON
  isJson?: boolean;
  // That endpoint needs of authentications
  isRequiredAuth?: boolean;
  // Function for return metadata for ClientRest;
  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
  queue?(data: any): Promise<void> | Function | void;
  // Function for return status code;
  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
  errStatusCode?(code: number, data?: any): Promise<void> | Function | void;
  // Function for return error;
  /**
 * This is to perform request actions and return metadata without having to rely on promises and async. 
 * You can use any way to get the metadata.
 * 
 * ```js
 *    FactoryData.get().queue((data) => {
 *         ... your code!
 *          console.log(data)
 *    })
 * ```
 * To receive status code errors or errors formulated by NodeJS or request management try these here.
 * ```js
 *     FactoryData.get()
 *        .queue((data) => {
 *              ... your code!
 *         })
 *        .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *        })
 * ``` 
 * 
 * There are possibilities for you to track status code when API returns to your Client.
 * 
 * ```js
 *    FactoryData.get()
 *      .queue((data) => {
 *              ... your code!
 *      })
 *      .err((error) => {
 *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
 *              console.error(error)
 *      })
 *      .errStatusCode((code) => {
 *               ... Your code!
 *                    or
 *              console.log(errStatusCode)
 *      })
 * ``` 
 * 
 * 
 * 
 *
 * Remembering you can receive the request manager and executioner by the queue
 * ```js
 *    FactoryData.get().queue((data, message) => {
 *        message.edit('Hello world!')
 *    })
 * ```
 */
  err?(err: Error): Promise<void> | Function | void;
}
export class RequestCreate {
    sessionToken!: string;
    route: Route<any, any>;
    restClient: RestClient;
    requestManager: RequestPacket;
    method?: MethodRequest;
    constructor(route: Route<any, any>, requestPacket: RequestPacket, restClient: RestClient, sessionToken: string) {
        if (sessionToken !== undefined && typeof sessionToken === 'string') {
            this.sessionToken = sessionToken
        }
        this.route = route
        if (route.method !== undefined) {
            this.method = route.body;
        }
        this.requestManager = requestPacket
        this.restClient = restClient
    }

    selectRequest<M>(_requestOptions: RequestOptions) {
        switch (this.route.method) {
        case MethodRequest.GET: {
            return this.GET<M>(_requestOptions)
        }
        case MethodRequest.DELETE: {
            return this.DELETE<M>(_requestOptions)
        }
        case MethodRequest.HEAD: {
            return this.HEAD<M>(_requestOptions)
        }
        case MethodRequest.OPTIONS: {
            return this.OPTIONS<M>(_requestOptions)
        }
        case MethodRequest.PATCH: {
            return this.PATCH<M>(_requestOptions)
        }
        case MethodRequest.POST: {
            return this.POST<M>(_requestOptions)
        }
        case MethodRequest.PUT: {
            return this.PUT<M>(_requestOptions)
        }
        default:
            throw new Error('RequestMethod invalid: ' + this.method);

        }
    }


    private prepareRoute(baseUrl: string, route: string) {
        return baseUrl + route
    }

    async GET<M>(_requestOptions: RequestOptions) {
        this.method = MethodRequest.GET;
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'x-bot-token': this.sessionToken,
                    'content-type': 'application/json'
                }
            }
        }


        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        }
        const request = axios.get(this.prepareRoute(url, this.route.path), options)

        return this.managerPromise<M>(request, _requestOptions);
    }

    async PUT<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'X-Bot-Token': this.sessionToken,
                    'Content-Type': 'application/json'
                }
            }
        }

        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        }
        const request = axios.put(this.prepareRoute(url, this.route.path), options)

        return this.managerPromise<M>(request, _requestOptions);
    }

    async POST<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'x-bot-token': this.sessionToken
                }
            }
        }

        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        } else {
            options.data = {}
        }

        const request = axios.post(this.prepareRoute(url, this.route.path), options.data, options)

        return this.managerPromise<M>(request, _requestOptions);
    }


    async PATCH<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'X-Bot-Token': this.sessionToken,
                    'Content-Type': 'application/json'
                }
            }
        }

        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        } else {
            options.data = {}
        }
        const request = axios.patch(this.prepareRoute(url, this.route.path), options.data, options)

        return this.managerPromise<M>(request, _requestOptions);
    }


    async DELETE<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'X-Bot-Token': this.sessionToken,
                    'Content-Type': 'application/json'
                }
            }
        }

        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        }
        const request = axios.delete(this.prepareRoute(url, this.route.path), options)

        return this.managerPromise<M>(request, _requestOptions);
    }


    async OPTIONS<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'X-Bot-Token': this.sessionToken,
                    'Content-Type': 'application/json'
                }
            }
        }

        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        }
        const request = axios.options(this.prepareRoute(url, this.route.path), options)

        return this.managerPromise<M>(request, _requestOptions);
    }



    async HEAD<M>(_requestOptions: RequestOptions) {
        const url = `${API.PROTOCOL + API.URL}`
        const options: any = {}

        if (_requestOptions.isRequiredAuth !== undefined) {
            if (_requestOptions.isRequiredAuth) {
                options.headers = {
                    'X-Bot-Token': this.sessionToken,
                    'Content-Type': 'application/json'
                }
            }
        }


        if (_requestOptions.body !== undefined) {
            options.data = _requestOptions.body
        }
        const request = axios.head(this.prepareRoute(url, this.route.path), options)

        return this.managerPromise<M>(request, _requestOptions);
    }



    async managerPromise<M>(request: Promise<AxiosResponse<any, any>>, _requestOptions: RequestOptions) {
        return request
            .then((http) => {
                let data

                try {
                    data = JSON.parse(http.data)
                } catch (_) {
                    data = http.data
                }

                if (http.status === 429) {
                    this.requestManager.emit('rateLimit', true)
                    const error = new Error(`RateLimit: ${data.retry_after}`)

                    if (_requestOptions.err !== undefined) {
                        _requestOptions.err(error)
                    }
                    throw error
                } else {
                    this.requestManager.emit('bump', true)
                }



                if (HeadersDetails.validateBucket(http.headers)) {
                    const getBucketHeader = HeadersDetails.getBucket(http.headers)
                    const details = {
                        "bucket": getBucketHeader.bucket,
                        "limit": getBucketHeader.limit,
                        "remaining": getBucketHeader.remaining,
                        "resetAfter": getBucketHeader.resetAfter
                    }
                    const bucket = this.restClient.bucketManager?.getRoute(this.route).bucket

                    bucket?.update(details)


                }
                if ((http.status >= 201)) {
                    if (_requestOptions.errStatusCode !== undefined) {
                        _requestOptions.errStatusCode(http.status)
                    }
                    throw new Error(`Status received is inappropriate: ${http.status}`);
                }


                const metadata: M = http.data

                if (_requestOptions.queue !== undefined) {

                    _requestOptions.queue(metadata)
                }
                return metadata;
            })
            .catch((err) => {
                if (err.response !== undefined) {
                    if (!(err.response.status == 429)) {
                        this.requestManager.emit('bump', true)
                    }
                    if (err.response.headers !== undefined) {
                        if (HeadersDetails.validateBucket(err.response.headers)) {
                            const getBucketHeader = HeadersDetails.getBucket(err.response.headers)
                            const details = {
                                "bucket": getBucketHeader.bucket,
                                "limit": getBucketHeader.limit,
                                "remaining": getBucketHeader.remaining,
                                "resetAfter": getBucketHeader.resetAfter
                            }
                            const bucket = this.restClient.bucketManager?.getRoute(this.route).bucket

                            bucket?.update(details)
                        }
                    }

                    try {
                        let dRatelimit

                        try {
                            const resolveData = (err.data != undefined ? err.data : err.response.data)

                            dRatelimit = typeof resolveData != 'string' ? resolveData : JSON.parse(resolveData)
                        } catch (_) {
                            throw new Error(`Error parsing metadata: ${_}`)
                        }
                        if (parseInt(err.response.status) == 429) {
                            this.requestManager.emit('rateLimit', dRatelimit)
                        }
                    } catch (_) {
                        throw new Error(`Could not verify or analyze bucket or start index:\n${_}`);
                    }

                    if (err.response.status >= 201) {
            // err.response.data
                        if (_requestOptions.errStatusCode !== undefined) {
                            _requestOptions.errStatusCode(parseInt(err.response.status), err.response.data == undefined ? {} : err.response.data)
                        }
                    }
                }
                if (_requestOptions.err !== undefined) {
                    _requestOptions.err(err)
                }

            })
    }


}