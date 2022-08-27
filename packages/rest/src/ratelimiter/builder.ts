import EventEmitter from 'events';
import { type MethodRequest, Route } from '../Route';
import { BucketManager, DetailsBucket, RequestItem, RequestOptions, RequestPacket, StateRequest } from '../RestClient';

export enum BucketStatus {
  None,
  EMPTY,
  COLD,
  WARM,
  BURST
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
  // @ts-ignore
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
    // @ts-ignore
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



