
export enum API {
  PROTOCOL = 'https://',
  URL = 'api.revolt.chat',
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

export interface BodyRouteRequired<_> { }
export interface NoRequired { }
export class Route<T> {
  method: MethodRequest;
  path: string;
  body?: T;
  constructor(method: MethodRequest, path: string, body?: T) {
    this.method = method;
    this.path = `${API.PROTOCOL + API.URL}${path}`;
    if (body !== undefined) {
      this.body = body;
    }
  }

  setMetadata(body: T) {
    this.body = body;
    return this;
  }
}