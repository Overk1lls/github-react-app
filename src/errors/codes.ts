export enum ErrorCode {
  JsonBad = 'json.bad',
  QueryBad = 'query.bad',

  AuthExpired = 'auth.expired',
  AuthNo = 'auth.no',
  AuthBadScheme = 'auth.bad.scheme',

  NotFound = 'not.found',

  Server = 'server',
}

export type ServerErrorCode = | ErrorCode.Server;