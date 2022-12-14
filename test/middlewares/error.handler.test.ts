import { createRequest, createResponse } from 'node-mocks-http';
import { ErrorCode } from '../../src/errors/codes';
import { NextFunction } from 'express';
import { requestErrorHandler } from '../../src/middlewares/handlers/error.handler';
import { RequestError } from '@octokit/request-error';

describe('error Handler middleware', () => {
  const req = createRequest();
  const next: NextFunction = () => null;

  describe('should handle SyntaxError', () => {
    it('should handle a JSON error', () => {
      expect.assertions(2);

      const error = new SyntaxError('JSON');
      const res = createResponse();

      requestErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(400);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.JsonBad,
          name: 'TypeError',
        })
      );
    });
  });

  describe('should handle RequestError', () => {
    it('should handle having error data message', () => {
      expect.assertions(2);

      const error = new RequestError('not found', 404, {
        request: {
          headers: {},
          method: 'GET',
          url: '',
        },
        response: {
          status: 404,
          headers: {},
          url: '',
          data: {
            message: 'error',
          },
        },
      });
      const res = createResponse();

      requestErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(404);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.NotFound,
          name: 'TypeError',
          message: 'error',
        })
      );
    });

    it('should handle not having error data message', () => {
      expect.assertions(2);

      const error = new RequestError('not found', 404, {
        request: {
          headers: {},
          method: 'GET',
          url: '',
        },
        response: {
          status: 404,
          headers: {},
          url: '',
          data: undefined,
        },
      });
      const res = createResponse();

      requestErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(404);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.NotFound,
          name: 'TypeError',
          message: 'not found',
        })
      );
    });
  });

  describe('should handle ServerError', () => {
    it('default (500)', () => {
      expect.assertions(2);

      const error = new Error('unknown error');
      const res = createResponse();

      requestErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(500);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.Server,
          name: 'TypeError',
        })
      );
    });
  });
});
