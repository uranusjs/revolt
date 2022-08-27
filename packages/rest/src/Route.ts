import { BucketLimiter, BucketType } from './ratelimiter/types';


export enum RoutePath {
  USERS,
  BOTS,
  CHANNELS,
  SERVERS,
  INVITES,
  CUSTOM,
  ONBOARD
}

export enum MethodRequest {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export interface RouteSpecifications<T, R> {
  body?: T;
  route?: R;
  template?: string;
}
export interface BodyRouteRequired<_> { }

export interface BucketRoute {
  limit: number;
  typeBucket: BucketType;
}

export interface NoRequired { }
export class Route<Body, Route> {
  method: MethodRequest;
  path: string;
  body?: Body;
  bucketRoute: BucketRoute = { limit: 0, typeBucket: BucketType.NONE };
  route?: RoutePath | null;
  template?: string;

  constructor(method: MethodRequest, path: string, routeSpecifications?: RouteSpecifications<Body, RoutePath>) {
    this.method = method;
    this.path = `${path}`;

    if (routeSpecifications !== null && routeSpecifications !== undefined) {
      if (routeSpecifications?.body !== undefined) {
        this.body = routeSpecifications.body;
      }
      if (routeSpecifications.route !== undefined) {
        this.route = routeSpecifications.route;
        switch (routeSpecifications.route) {
          case RoutePath.USERS: {
            this.bucketRoute.limit = BucketLimiter.USERS;
            this.bucketRoute.typeBucket = BucketType.USERS;
          }
            break;
          case RoutePath.BOTS: {
            this.bucketRoute.limit = BucketLimiter.BOTS;
            this.bucketRoute.typeBucket = BucketType.BOTS;
          }
            break;
          case RoutePath.CHANNELS: {
            if (routeSpecifications.template?.endsWith('/messages')) {
              this.bucketRoute.limit = BucketLimiter.MESSAGING
              this.bucketRoute.typeBucket = BucketType.MESSAGING;
            } else {
              this.bucketRoute.limit = BucketLimiter.CHANNELS
              this.bucketRoute.typeBucket = BucketType.CHANNELS;
            }
          }
            break;
          case RoutePath.SERVERS: {
            this.bucketRoute.limit = BucketLimiter.SERVERS;
            this.bucketRoute.typeBucket = BucketType.SERVERS;
          }
            break;
          default:

            break;
        }
      }
      if (routeSpecifications.template !== undefined) {
        this.template = routeSpecifications.template;
      } else {
        this.template = '{route-unknown-print}'
      }
    }
    this.route = null;
  }

  setMetadata(body: Body) {
    this.body = body;
    return this;
  }
}