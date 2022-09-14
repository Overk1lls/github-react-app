import { Request } from 'express';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';

const bearerRegex = /^Bearer +/;

export function getTokenFromRequest(req: Request) {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    throw new LogicError(ErrorCode.AuthNo);
  }
  return getTokenFromAuthString(authorization);
}

export function getTokenFromAuthString(str: string) {
  if (!bearerRegex.test(str)) {
    throw new LogicError(ErrorCode.AuthBadScheme);
  }
  return str.replace(bearerRegex, '');
}
