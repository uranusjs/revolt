

export enum RoutePath {
  USERS,
  BOTS,
  CHANNELS,
  SERVERS,
  INVITES,
  CUSTOM
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
  route?: R
}
export interface BodyRouteRequired<_> { }
export interface NoRequired { }
export class Route<T, R> {
  method: MethodRequest;
  path: string;
  body?: T;
  route?: R | null;
  constructor(method: MethodRequest, path: string, routeSpecifications?: RouteSpecifications<T, R>) {
    this.method = method;
    this.path = `${path}`;
    if (routeSpecifications !== null && routeSpecifications !== undefined) {
      if (routeSpecifications?.body !== undefined) {
        this.body = routeSpecifications.body;
      }
      if (routeSpecifications.route !== undefined) {
        this.route = routeSpecifications.route
      }
    }
    this.route = null;
  }

  setMetadata(body: T) {
    this.body = body;
    return this;
  }
}