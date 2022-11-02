import { createRequest, createResponse } from 'node-mocks-http';
import { LogicError } from '../../src/errors/logic.error';
import { ErrorCode } from '../../src/errors/codes';
import { NextFunction } from 'express';
import { logicErrorHandler } from '../../src/middlewares/handlers/logic-error.handler';

describe('error Handler middleware', () => {
  const req = createRequest();
  const next: NextFunction = () => null;

  describe('should handle LogicError', () => {
    it('should handle the default error (400)', () => {
      expect.assertions(2);

      const error = new LogicError(ErrorCode.JsonBad);
      const res = createResponse();

      logicErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(400);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.JsonBad,
          name: 'TypeError',
        })
      );
    });

    it('should handle the AuthNo error', () => {
      expect.assertions(2);

      const error = new LogicError(ErrorCode.AuthNo);
      const res = createResponse();

      logicErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(401);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.AuthNo,
          name: 'TypeError',
        })
      );
    });

    it('should handle the AuthExpired error', () => {
      expect.assertions(2);

      const error = new LogicError(ErrorCode.AuthExpired);
      const res = createResponse();

      logicErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(403);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.AuthExpired,
          name: 'TypeError',
        })
      );
    });

    it('should handle the NotFound error', () => {
      expect.assertions(2);

      const error = new LogicError(ErrorCode.NotFound);
      const res = createResponse();

      logicErrorHandler(error, req, res, next);

      const result = res._getJSONData();

      expect(res._getStatusCode()).toBe(404);
      expect(result).toStrictEqual(
        expect.objectContaining({
          code: ErrorCode.NotFound,
          name: 'TypeError',
        })
      );
    });
  });
});
