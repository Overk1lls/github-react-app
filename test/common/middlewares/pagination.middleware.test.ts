import { NextFunction, Request, Response } from 'express';
import {
  PaginationMiddleware,
  RequestWithPagination,
} from '../../../src/common/middlewares/pagination.middleware';

const req = {} as Request;
const res = {} as Response;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const next: NextFunction = () => {};

describe('PaginationMiddleware', () => {
  let middleware: PaginationMiddleware;

  beforeEach(async () => {
    middleware = new PaginationMiddleware();
  });

  describe('Pagination use', () => {
    test('should return request with both skip and limit undefined', () => {
      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toEqual({
        skip: undefined,
        limit: undefined,
      });
    });

    test('should return request with skip defined and limit undefined', () => {
      req.query = {
        skip: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toEqual({
        skip: 1,
        limit: undefined,
      });
    });

    test('should return request with skip undefined and limit defined', () => {
      req.query = {
        limit: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toEqual({
        skip: undefined,
        limit: 1,
      });
    });

    test('should return request with both skip and limit defined', () => {
      req.query = {
        skip: '1',
        limit: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toEqual({
        skip: 1,
        limit: 1,
      });
    });
  });
});
