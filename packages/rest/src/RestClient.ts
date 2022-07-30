import axios from 'axios';
import { EventEmitter } from 'node:events';
import type { Route, RoutePath } from './Route';


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

export class Bucket {
  bucketId: string;
  bucketManager: BucketManager;
  route: Map<RoutePath, RequestPacket>;

  // Pause requests as soon as time is up to start another bucket refill 
  rateLimit?: boolean;
  limit?: number;
  remaining?: number;
  resetAfter?: number;
  constructor(id: string, bucketManager: BucketManager, details: DetailsBucket) {
    this.bucketId = id;
    this.bucketManager = bucketManager;

    // Save route!
    this.route = new Map();

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
        this.resetAfter = details.resetAfter;
      }
    }
  }


}

export interface HeadersDetailsI {
  'x-ratelimit-bucket': string;
  'x-ratelimit-limit': number;
  'x-ratelimit-remaining': number;
  'x-ratelimit-reset-after': number;
}

export class HeadersDetails {
  static toDetails(bucket: string, limit: number, remaining: number, resetAfter: number) {

  }


  static checkDetails() {

  }
  

  static validateBucket(headers: Record<string, string> & {
    "set-cookie"?: string[]
  }) {
   
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
  buckets: Map<string, Bucket>
  constructor() {
    this.buckets = new Map()
  }


  getBucket(id: string, details?: DetailsBucket) {
    if (this.buckets.get(id) == undefined) {
      const bucket = new Bucket(id, this, details!!)
      this.buckets.set(id, bucket)
      return bucket
    }

    return this.buckets.get(id)
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
        this.bucketManager = new BucketManager()
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
  constructor() {
    super();
  }
}

export interface RequestOptions {
  body?: any;
  queue?: Function | Promise<void>
}
export class RequestCreate {
  route: Route<any, any>;
  restClient: RestClient;
  requestManager: RequestPacket;
  constructor(route: Route<any, any>, requestPacket: RequestPacket, restClient: RestClient) {
    this.route = route
    this.requestManager = requestPacket
    this.restClient = restClient
  }

  private prepareRoute(baseUrl: string, route: string) {
    return baseUrl + route
  }

  async GET(_requestOptions: RequestOptions) {
    const url = `${API.PROTOCOL + API.URL}`
    const request = axios.get(this.prepareRoute(url, this.route.path))
    request.then((http) => {
      if (!(http.status >= 201)) {
        throw new Error(`Status received is inappropriate: ${http.status}`);
      }
      const getBucketHeader = HeadersDetails.getBucket(http.headers)
      this.restClient.bucketManager?.getBucket(getBucketHeader['x-ratelimit-bucket'], {
        bucket: getBucketHeader['x-ratelimit-bucket'],
        limit: getBucketHeader['x-ratelimit-limit'],
        remaining: getBucketHeader['x-ratelimit-remaining'],
        resetAfter: getBucketHeader['x-ratelimit-reset-after']
      })
      
    })
  }


}