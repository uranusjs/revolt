import axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'node:events';
import { MethodRequest, Route } from './Route';

export interface RestActionRelieve {
  route: Route<any, any>;
  requestOptions: RequestOptions;
}

export interface RestActionI<R, T> {
  rest: RestClient;
  route: Route<R, T>;
  requestOptions: RequestOptions;
}

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

export enum BucketStatus {
  None,
  EMPTY,
  COLD,
  WARM,
  BURST
}

export interface DataRequest {
  id: string;
  requestRoute: Route<any, any>;
  requestOptions?: RequestOptions;
  requestPacket: RequestPacket;
  // We can trace this route to find the bucket
  track?: Boolean;
}


export interface StateRequest {
  id: number;
  b: Array<RequestItem>;

}

export class BucketMap extends Array<StateRequest> {
  protected sizeBucket: number = 0;
  bucketRequest: BucketRequest | null | undefined = null;
  private bucketDefault: Bucket | null | undefined;
  protected limiter: number = 50;
  private id = -1;
  public workingWithBucket: number = -1;
  private newBucket: number = 0;
  public item: number = 0;
  constructor(bucketRequest: BucketRequest, bucketDefault: Bucket) {
    super();
    if (bucketRequest !== undefined) {
      this.bucketRequest = bucketRequest;
    }
    if (bucketDefault !== undefined) {
      this.bucketDefault = bucketDefault;
    }
  }

  get size() {
    return this.length
  }

  get(id: any) {
    return this[id] == undefined ? undefined : this[id]
  }

  setBucket(requestItem: RequestItem) {
    if (this.length >= this.limiter) return;
    if (this.bucketDefault!!.limit <= 0) return;
    this.getNewBucket()
    const value = Math.max(this.newBucket, 0)

    if (this.get(value) == undefined
      && this.get(value) == null) {
      const d = new Array()

      d.push(requestItem)

      this.push({
        id: this.id++,
        b: d
      })
    } else {
      const d = this.get(value)

      if (d !== undefined) {

        if (d.b.length >= Math.max(this.bucketDefault!!.limit, 1)) {
          // Next queue
          const newBucket = new Array()

          newBucket.push(requestItem)


          this.newBucket++;
          this.push(d)
        } else {
          d?.b.push(requestItem)
        }
      }


    }
  }

  private getNewBucket() {
    let p = 0;
    let everyBucketFull = false
    for (const o of this) {
      p++;
      if (this.bucketDefault?.limit !== 0) {
        if (o.b.length >= this.bucketDefault!!.limit) {
          everyBucketFull = true
        } else {
          everyBucketFull = false
          this.newBucket = p;
          break
        }
      }
    }

    if (everyBucketFull) {
      this.newBucket = this.length
    }
    return p
  }

  nextBucket() {
    if (this.item <= -1) {
      this.item = -1;
      return
    }
    return this.item;
  }

  backBucket() {
    if (this.item - 1 <= -1) {
      this.item = 0;
      return this.item;
    }
    return this.item;
  }

  selectBucket() {
    this.workingWithBucket = this.item;
  }

  getBucket() {
    return this.get(this.item)
  }

  deleteBucket() {
    this.shift()
  }

  checkRequestFuture() {
    return !(this.size == 0)
  }


}


export enum ReasonBucket {
  INVALID,
  API_RATE_LIMITE,
  BUCKET_FULL,
  None
}

export class BucketRequest extends EventEmitter {
  protected queue: BucketMap;
  protected bucketDefault: Bucket;
  protected queueIn: number = 0;
  private started: boolean = false;
  private limited: boolean = false;
  private workingBalde: boolean = false;

  working: boolean = false;
  constructor(bucketDefault: Bucket) {
    super();
    this.bucketDefault = bucketDefault
    this.queue = new BucketMap(this, bucketDefault);
    this.eventOn()
  }


  readyForRequest() {
    return this.queue.checkRequestFuture()
  }

  addRequest(requestItem: RequestItem) {
    if (requestItem !== undefined) {
      if (this.bucketDefault.checkRateLimit()) {
        this.queue.setBucket(requestItem)
      } else {
        this.executorRequest(requestItem)
      }
      if (!this.started) {
        this.emit('start')
      }
    }
  }


  get getPositionQueue() {
    return this.queueIn
  }

  private eventOn() {
    this.bucketDefault.on('resetBucket', () => {
      if (!(this.queue.length <= 0)) {
        this.emit('next')
      }
    })
    this.on('start', () => {
      this.started = true;
    })
    this.on('next', () => {
      if (this.queue.checkRequestFuture()) {
        this.nextRequest()
      }
    })
    this.on('empty', () => {
      this.limited = false
      this.started = false
    })
    this.on('checkBucket', () => {
      if (!(this.queue.length <= 0)) {
        if (this.queue.checkRequestFuture()) {
          this.nextRequest()
        }
      }
    })
  }


  private dispatch() {
    if (!(this.queue.size <= 0)) {
      this.nextRequest()
    } else {
      this.emit('There is no way to dispatch requests!')
    }
  }

  protected async nextRequest() {
    if (this.workingBalde) return;
    this.workingBalde = true;
    const bucket = this.queue.getBucket()
    let noDelete = true;
    let needHeaders = true;

    if (bucket !== undefined) {
      for (const a of bucket.b) {
        const req = await this.executorFutureRequest(a, needHeaders)
        if (req == ReasonBucket.None) {
          needHeaders = false
        } else if (req == ReasonBucket.BUCKET_FULL) {
          noDelete = false
          break
        } else if (req === ReasonBucket.INVALID) {
          needHeaders = false
        }
      }
      this.workingBalde = false;
      if (noDelete) {
        await this.queue.deleteBucket();
        await this.emit('next')
      }
    }
  }

  protected executorFutureRequest(requestItem?: RequestItem, checkHeaders?: boolean): Promise<ReasonBucket> {
    let bucketOnAlert = false;
    if (this.bucketDefault.status >= BucketStatus.BURST) {
      bucketOnAlert = true
    }
    return new Promise((res) => {
      if (requestItem == undefined && requestItem == null) {
        res(ReasonBucket.INVALID)
        this.emit('executorRequestFutureError', 'Request invalid!', new Error('RequestInvalid'))
      } else {
        const action = () => requestItem.requestPacket.build(requestItem.requestRoute, requestItem.requestOptions!!)
        const updateState = () => {
          if (checkHeaders !== undefined && !checkHeaders) {
            if (this.bucketDefault.read) {
              if (this.bucketDefault.remaining <= 0) {
                this.bucketDefault.rateLimit = true;
                res(ReasonBucket.BUCKET_FULL)
                return
              } else {
                this.bucketDefault.remaining--;
              }
            }
          }
        }
        updateState()
        requestItem.requestPacket.on('bump', () => {
          this.bucketDefault.rateLimit = false;
          requestItem.rateLimit = false;
          if (checkHeaders || bucketOnAlert) {
            if (this.bucketDefault.status >= BucketStatus.WARM) {
              setTimeout(() => {
                res(ReasonBucket.None)
              }, 1 * 1000);
            } else {
              res(ReasonBucket.None)
            }
          }
        })

        requestItem.requestPacket.on('rateLimit', (data: any) => {
          if (data.retry_after !== undefined) {
            this.bucketDefault.rateLimit = true
            setTimeout(() => {
              action()
            }, Math.max(data.retry_after + 1 * 1000, 2 * 1000));
          }
        })
        action()
      }
      if (!bucketOnAlert) {
        if (!checkHeaders) {
          if (this.bucketDefault.status >= BucketStatus.WARM) {
            setTimeout(() => {
              res(ReasonBucket.None)
            }, 1 * 1000);
          } else {
            res(ReasonBucket.None)
          }
        }
      }

    })
  }

  protected executorRequest(requestItem?: RequestItem) {
    if (requestItem == undefined && requestItem == null) {
      this.emit('executorRequestError', 'Request invalid!', new Error('RequestInvalid'))
    } else {
      const action = () => requestItem.requestPacket.build(requestItem.requestRoute, requestItem.requestOptions!!)
      if (this.bucketDefault.read) {
        if (this.bucketDefault.remaining <= 1) {
          this.bucketDefault.rateLimit = true;
        } 
        this.bucketDefault.remaining--;
      }
      requestItem.requestPacket.on('bump', () => {
        this.bucketDefault.rateLimit = false;
        requestItem.rateLimit = false;
      })
      requestItem.requestPacket.on('rateLimit', (data: any) => {
        if (data.retry_after !== undefined) {
          this.bucketDefault.rateLimit = true
          setTimeout(() => {
            action()
          }, Math.max(data.retry_after, 2 * 1000));
        }
      })
      action()
    }

  }



  getBuckets() {
    return this.queue.size
  }

}

export class Bucket extends EventEmitter {
  id: string = ''
  private method?: MethodRequest | null = null;
  private route?: Route<any, any> | null = null;
  private bucketRequests: BucketRequest = new BucketRequest(this);
  private reset: NodeJS.Timeout | undefined | null = null;
  protected bucketManager?: BucketManager;
  public read: boolean = false;
  private bucketSettings = false;
  private timeCheck: number = 0;
  private time: number = 0;
  bucketId: number = 0;
  limit: number = 0;
  remaining: number = 0;
  resetAfter: number = 0;
  limitExceeded: boolean = false;
  rateLimit: boolean = false;
  requests: number = 0;
  status: BucketStatus = BucketStatus.None;

  constructor(id: string, bucketManager: BucketManager, details?: DetailsBucket) {
    super()
    if (id !== undefined) {
      this.id = id
    }
    if (bucketManager !== undefined && bucketManager instanceof BucketManager) {
      this.bucketManager = bucketManager
    }
    if (details !== undefined) {
      this.update(details)
    }
    this.checkBucket()
  }


  setRoute(route: Route<any, any>) {
    if (route !== undefined) {
      if (route instanceof Route<any, any>) {
        this.route = route
      }
    }
  }
  getRoute() {
    return this.route
  }

  getMethod() {
    return (this.method == undefined && this.method == null) ? this.route?.method!! : this.method!!
  }
  protected breakBucket() {
    this.emit('debugMessage', this, `Bucket(${this.id}/${this.route?.method}) is broken remaking a new one.`)
    this.bucketManager?.buckets.get(this.id)
  }

  protected setMethod(method: MethodRequest) {
    if (method !== undefined) {
      this.method = method
    }
  }

  update(details: DetailsBucket) {
    if ((details.limit !== undefined && details.limit > this.limit) && this.limit <= 0) {
      this.emit('debugMessage', this, `Changing bucket(${this.id}/${this.route?.method}) limit to ${details.limit}`)
      this.limit = details.limit
    }
    if (details.remaining !== undefined) {
      if (this.remaining <= -1) {
        this.emit('debugMessage', this, `Changing bucket(${this.id}/${this.route?.method}) remaining to ${details.remaining}`)
        this.remaining = details.remaining
      }
    }
    if (details.bucket !== undefined && this.bucketId <= 0) {
      this.emit('debugMessage', this, `Changing bucket(${this.id}/${this.route?.method}) bucketId to ${details.bucket}`)
      this.bucketId = details.bucket
    }
    if (details.resetAfter !== undefined) {
      if (details.resetAfter >= this.resetAfter && this.resetAfter <= 0) {
        this.resetAfter = details.resetAfter
        if (details.resetAfter !== 0) {
          this.read = true;
          this.emit('debugMessage', this, `Changing bucket(${this.id}/${this.route?.method}) resetAfter to ${details.resetAfter}`)
          this.reset = setTimeout(() => {
            this.resetBucket()
            this.time = Date.now() + 6 * 1000
          }, Math.max(details.resetAfter, 10 * 1000));
        }
      }
    }
  }

  protected checkBucket() {
    let saveStateBucket: BucketStatus;
    const checking = setInterval(() => {
      if (this.resetAfter <= 0 && this.reset == null) {
        if (!(this.time <= 0)) {
          if ((this.time - Date.now()) <= 0) {
            this.time = 0;
            this.bucketRequests.emit('checkBucket')
          }
        }
      }
      if (this.status !== saveStateBucket) {
       
        if (this.bucketRequests.getBuckets() >= 105) {
          if (this.status != BucketStatus.WARM) {
            this.emit('debugMessage', this, `Bucket(${this.id}/${this.route?.method}) limit has been capped to prevent API abuse!`)
            this.setReasonBucket(BucketStatus.WARM)
          }
        } else if (this.bucketRequests.getBuckets() >= 40) {
          if (this.status != BucketStatus.BURST) {
            this.emit('debugMessage', this, `This bucket(${this.id}/${this.route?.method}) is required to have delay. There are a lot of requests`)
            this.setReasonBucket(BucketStatus.BURST)
          }
        } else if (this.bucketRequests.getBuckets() >= 20) {
          if (this.status != BucketStatus.COLD) {
            this.setReasonBucket(BucketStatus.COLD)
          }
        } else if (this.bucketRequests.getBuckets() <= 0) {
          if (this.status != BucketStatus.EMPTY) {
            this.setReasonBucket(BucketStatus.EMPTY)
          }
        }
      }
     
    }, 200)


    this.once('closeBucket', () => clearInterval(checking))
  }


  setBucketSettings(route: Route<any, any>) {
    if (!this.bucketSettings) {
      this.bucketSettings = true
      this.emit('traceMessage', this, route.bucketRoute, `This route has a specific bucket(${this.id}/${this.route?.method}) configuration!`)
      this.limit = route.bucketRoute.limit;
      this.remaining = route.bucketRoute.limit;
    }
  }

  setReasonBucket(bucketStatus: BucketStatus) {
    switch (bucketStatus) {
      case BucketStatus.None: {
        this.status = BucketStatus.None;
      }
      case BucketStatus.EMPTY: {
        this.emit('debugMessage', this, `Now the bucket(${this.id}/${this.route?.method}) is empty!`)
        this.status = BucketStatus.EMPTY
      }
        break;
      case BucketStatus.COLD: {
        this.emit('debugMessage', this, `Looks like the bucket(${this.id}/${this.route?.method}) is getting cold`)
        this.status = BucketStatus.COLD
      }
        break;
      case BucketStatus.BURST: {
        this.emit('debugMessage', this, `Bucket(${this.id}/${this.route?.method}) is getting hot let's stop for a while...`)
        this.status = BucketStatus.BURST
      }
        break;
      case BucketStatus.WARM: {
        this.emit('debugMessage', this, `Bucket(${this.id}/${this.route?.method}) is too hot adding 12 second delay!`)
        this.status = BucketStatus.WARM
      }
        break;
      default:
        this.emit('debugMessage', this, `I received bucket(${this.id}/${this.route?.method}) status unknown. This will not apply!`)
        break;
    }
  }


  nextRequestCheck() {
    if (this.limit !== 0) {
      if (this.requests + 1 >= this.limit) {
        return true
      }
      if (this.remaining - 1 <= 1) {
        return true
      }
    }
    return false
  }

  checkRateLimit() {
    if (this.limit !== 0) {
      if (this.bucketRequests.readyForRequest()) {
        return true
      }
      if (this.remaining - 1 <= 1) {
        this.rateLimit = true;
        return true
      }
    }
    return false
  }


  protected resetBucketDefault() {
    this.rateLimit = false;
    this.remaining = this.limit
    this.requests = 0;
  }

  addRequest() {
    this.requests++;
  }

  protected resetBucket() {
    this.emit('debugMessage', this, `Emptying the bucket(${this.id}/${this.route?.method})`)
    this.emit('resetBucket', this)
    this.remaining = Math.max(this.limit, 0);
    this.resetAfter = 0;
    this.limitExceeded = false;
    this.rateLimit = false;

    if (this.reset !== undefined && this.reset !== null) {
      clearTimeout(this.reset)
    }
    this.reset = null;
  }

  registerRequest(route: Route<any, any>, requestOptions: RequestOptions, requestPacket: RequestPacket, rateLimit: boolean) {
    const d = {
      rateLimit: rateLimit,
      requestRoute: route,
      requestOptions: requestOptions,
      requestPacket: requestPacket
    }
    this.bucketRequests.addRequest(d)
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
      bucket: parseInt(headers['x-ratelimit-bucket']),
      limit: parseInt(headers['x-ratelimit-limit']),
      remaining: parseInt(headers['x-ratelimit-remaining']),
      resetAfter: parseInt(headers['x-ratelimit-reset-after'])
    }
  }

}
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

    bucket.on('debugMessage', (d, msg) => {
      this.emit('debugRest', d, msg)
    })
    bucket.on('traceMessage', (d, msg) => {
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
          if (a[1].getRoute()?.path === route.path && a[1].getRoute()!!.method) {
            requestCreate = a[1].getRoute()!!
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
    return new RequestCreate(route, this, this.restClient!!, this.sessionToken)
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
            bucket: getBucketHeader.bucket,
            limit: getBucketHeader.limit,
            remaining: getBucketHeader.remaining,
            resetAfter: getBucketHeader.resetAfter
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
                bucket: getBucketHeader.bucket,
                limit: getBucketHeader.limit,
                remaining: getBucketHeader.remaining,
                resetAfter: getBucketHeader.resetAfter
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