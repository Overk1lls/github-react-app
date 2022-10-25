import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { mockToken } from '../../test/__mock__';
import { getTokenFromAuthString, getTokenFromRequest } from './auth';

describe('lib/auth', () => {
  describe('getTokenFromRequest', () => {
    test('should return a token', () => {
      const req = {
        headers: {
          authorization: 'Bearer ' + mockToken,
        },
      } as Request;

      const result = getTokenFromRequest(req);

      expect(result).toBe(mockToken);
    });

    test('should throw UnauthorizedException', () => {
      const req = {} as Request;

      const invokeFn = () => getTokenFromRequest(req);

      expect(invokeFn).toThrowError(UnauthorizedException);
    });
  });

  describe('getTokenFromAuthString', () => {
    test('should return a token', () => {
      const string = 'Bearer ' + mockToken;

      const result = getTokenFromAuthString(string);

      expect(result).toBe(mockToken);
    });

    test('should throw UnauthorizedException', () => {
      const string = 'Not bearer';

      const invokeFn = () => getTokenFromAuthString(string);

      expect(invokeFn).toThrowError(UnauthorizedException);
    });
  });
});
