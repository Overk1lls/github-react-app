import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

const bearerRegex = /^Bearer +/;

export function getTokenFromRequest(req: Request) {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    throw new HttpException('Bad authentication (unauthorized)', HttpStatus.UNAUTHORIZED);
  }
  return getTokenFromAuthString(authorization);
}

export function getTokenFromAuthString(str: string) {
  if (!bearerRegex.test(str)) {
    throw new HttpException('Bad authentication scheme', HttpStatus.UNAUTHORIZED);
  }
  return str.replace(bearerRegex, '');
}
