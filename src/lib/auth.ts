import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

const bearerRegex = /^Bearer +/;

export function getTokenFromRequest(req: Request) {
  if (typeof req.headers?.authorization !== 'string') {
    throw new UnauthorizedException();
  }
  return getTokenFromAuthString(req.headers.authorization);
}

export function getTokenFromAuthString(str: string) {
  if (!bearerRegex.test(str)) {
    throw new UnauthorizedException('Bad authentication scheme');
  }
  return str.replace(bearerRegex, '');
}
