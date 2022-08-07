

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
  route?: R;
  template?: string;
}
export interface BodyRouteRequired<_> { }
export interface NoRequired { }
export class Route<T, R> {
  method: MethodRequest;
  path: string;
  body?: T;
  route?: R | null;
  template?: string;

  constructor(method: MethodRequest, path: string, routeSpecifications?: RouteSpecifications<T, R>) {
    this.method = method;
    this.path = `${path}`;
    
    if (routeSpecifications !== null && routeSpecifications !== undefined) {
      if (routeSpecifications?.body !== undefined) {
        this.body = routeSpecifications.body;
      }
      if (routeSpecifications.route !== undefined) {
        this.route = routeSpecifications.route;
      }
      if (routeSpecifications.template !== undefined) {
        this.template = routeSpecifications.template;
      } else {
        this.template = '{route-unknown-print}'
      }
    }
    this.route = null;
  }

  setMetadata(body: T) {
    this.body = body;
    return this;
  }
}