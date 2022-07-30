import type { RoutePath } from './Route';
import { EventEmitter } from 'node:events';
export interface DetailsBucket {
  bucket: string;
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
        throw new Error('Missing x-ratelimit-bucket-id')
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

export class BucketManager {

}


export interface RestClientI {
  sessionToken: string;
  bucketManager: BucketManager;
}


export class RequestRouteManager {
  rateLimit: boolean;
  constructor() {
    this.rateLimit = false;

  }
}

export interface RequestPacket {
  on(event: 'ready', listener: any): this;
  on(event: 'error', listener: any): this;
  on(event: 'rateLimitGlobal', listener: any): this;
  on(event: 'rateLimit', listener: any): this;
  on(event: 'restoredBucket', listener: any): this;
}
export class RequestPacket extends EventEmitter {
  constructor() {
    super();
  }
}