import axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'node:events';
import { MethodRequest, Route } from './Route';


export enum API {
  PROTOCOL = 'https://',
  URL = 'api.revolt.chat',
}


export interface DetailsBucket {
  bucket: string;
  limit: number;
  remaining: number;
  resetAfter: number;
}

export interface DataRequest {
  id: string;
  requestRoute: Route<any, any>;
  requestCreate: RequestCreate;
}

export class Bucket {
  bucketId: string;
  bucketManager: BucketManager;
  route: DataRequest[];

  // Pause requests as soon as time is up to start another bucket refill 
  rateLimit?: boolean;
  limit?: number;
  remaining?: number;
  resetAfter?: number;
  requests: number;

  constructor(id: string, bucketManager: BucketManager, details: DetailsBucket) {
    this.bucketId = id;
    this.bucketManager = bucketManager;
    this.requests = 0;
    // Save route!
    this.route = new Array();
    // Information of Bucket(Header)
    if (details !== undefined && details !== null) {
      if (details.bucket === undefined) {
        throw new Error('Missing x-ratelimit-bucket')
      } else {
        this.bucketId = details.bucket;
      }

      if (details.remaining === undefined) {
        throw new Error('Missing x-ratelimit-remaining')
      } else {
        this.remaining = details.remaining;
      }
      if (details.resetAfter === undefined) {
        throw new Error('Missing x-ratelimit-reset-after')
      } else {
        setTimeout(() => {
          // Delete bucket
          this.bucketManager.buckets.delete(this.bucketId);
        }, details.resetAfter);
        this.resetAfter = details.resetAfter;
      }
    }
  }

  registerRoute(request: RequestCreate) {
    const id = Array.from({ length: Math.min(1, Math.floor(Math.random() * 9)) },
      () => { return Buffer.from(`${Math.floor(Math.random() * 10000000000000000000000000)}`).toString('base64') })
    this.route.push({
      id: Buffer.from(id.join('')).toString('base64').substring(0, 14),
      requestRoute: request.route,
      requestCreate: request
    })
  }

}

export interface HeadersDetailsI {
  'x-ratelimit-bucket': string;
  'x-ratelimit-limit': number;
  'x-ratelimit-remaining': number;
  'x-ratelimit-reset-after': number;
}

export class HeadersDetails {

  static validateBucket(headers: Record<string, string> & {
    "set-cookie"?: string[]
  }) {
    if (headers['X-RateLimit-Bucket'] === undefined) {
      return false
    }
    if (headers['X-RateLimit-Limit'] === undefined) {
      return false
    }
    if (headers['X-RateLimit-Remaining'] === undefined) {
      return false
    }
    if (headers['X-RateLimit-Reset-After'] === undefined) {
      return false
    }
    return true
  }


  static getBucket(headers: Record<string, string> & {
    "set-cookie"?: string[]
  }) {
    return {
      'x-ratelimit-bucket': headers['X-RateLimit-Bucket'],
      'x-ratelimit-limit': parseInt(headers['X-RateLimit-Limit']),
      'x-ratelimit-remaining': parseInt(headers['X-RateLimit-Remaining']),
      'x-ratelimit-reset-after': parseInt(headers['X-RateLimit-Reset-After'])
    }
  }

}
export class BucketManager {
  private readonly sessionToken!: string;
  buckets: Map<string, Bucket>
  constructor(sessionToken: string) {
    if (sessionToken !== undefined && typeof sessionToken === 'string') {
      this.sessionToken = sessionToken
    }
    this.buckets = new Map()
  }

  // API returns 429
  setRatelimitBucket(id: string) {
    if (this.buckets.get(id) !== undefined && this.buckets.get(id) !== null) {
      this.buckets.get(id)!!.rateLimit = true
    }
  }


  getBucket(id: string, details?: DetailsBucket) {
    if (this.buckets.get(id) == undefined) {
      const bucket = new Bucket(id, this, details!!)
      this.buckets.set(id, bucket)
      return bucket
    }

    return this.buckets.get(id)
  }

  getRoute(route: Route<any, any>) {
    let bucket: Bucket | undefined
    let requestCreate: RequestCreate | undefined
    for (const a of this.buckets) {
      if (this.buckets.get(a[0]) !== undefined) {
        bucket = a[1]
        if (this.buckets.get('')?.route !== undefined) {
          for (const b of this.buckets.get(a[0])!!.route) {
            if (route.path === b.requestRoute.path) {
              requestCreate = b.requestCreate
              break
            }
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
  private readonly sessionToken!: string;
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
        this.bucketManager = new BucketManager(this.sessionToken)
      }
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
  private readonly sessionToken!: string;
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

  build(route: Route<any, any>) {
    return new RequestCreate(route, this, this.restClient!!, this.sessionToken)
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
  queue?(data: any): Promise<void> | Function;
  // Function for return status code;
  errStatusCode?(code: number): Promise<void> | Function;
  // Function for return error;
  err?(err: Error): Promise<void> | Function;
}
export class RequestCreate {
  private readonly sessionToken!: string;
  route: Route<any, any>;
  restClient: RestClient;
  requestManager: RequestPacket;
  method?: MethodRequest;
  constructor(route: Route<any, any>, requestPacket: RequestPacket, restClient: RestClient, sessionToken: string) {
    if (sessionToken !== undefined && typeof sessionToken === 'string') {
      this.sessionToken = sessionToken
    }
    this.route = route
    this.requestManager = requestPacket
    this.restClient = restClient
  }


  private prepareRoute(baseUrl: string, route: string) {
    return baseUrl + route
  }

  async GET<M>(_requestOptions: RequestOptions) {
    this.method = MethodRequest.GET;
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.isRequiredAuth) {
      options.headers['X-Session-Token'] = this.sessionToken
    }
    const request = axios.get(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }

  async PUT<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.put(this.prepareRoute(url, this.route.path), options)
    
    this.managerPromise<M>(request, _requestOptions);
  }

  async POST<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.post(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }


  async PATCH<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.patch(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }


  async DELETE<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.delete(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }


  async OPTIONS<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.options(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }



  async HEAD<M>(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const options: any = {}

    if (_requestOptions.body !== undefined) {
      options.data = _requestOptions.body
    }
    const request = axios.head(this.prepareRoute(url, this.route.path), options)

    this.managerPromise<M>(request, _requestOptions);
  }



  async managerPromise<M>(request: Promise<AxiosResponse<any, any>>, _requestOptions: RequestOptions) {
    request
      .then((http) => {
        const data = JSON.parse(http.data)

        if (http.status === 429) {
          const error = new Error(`RateLimit: ${data.retry_after}`)
          if (_requestOptions.err !== undefined) {
            _requestOptions.err(error)
          }
          throw error
        }


        if (HeadersDetails.validateBucket(http.headers)) {
          const getBucketHeader = HeadersDetails.getBucket(http.headers)
          const bucket = this.restClient.bucketManager?.getBucket(getBucketHeader['x-ratelimit-bucket'], {
            bucket: getBucketHeader['x-ratelimit-bucket'],
            limit: getBucketHeader['x-ratelimit-limit'],
            remaining: getBucketHeader['x-ratelimit-remaining'],
            resetAfter: getBucketHeader['x-ratelimit-reset-after']
          })


          if (http.status == 429) {
            this.restClient.bucketManager?.setRatelimitBucket(bucket?.bucketId!!)
          }


        }

        if (!(http.status >= 201)) {
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
        if (_requestOptions.err !== undefined) {
          _requestOptions.err(err)
        }
      })
  }


}