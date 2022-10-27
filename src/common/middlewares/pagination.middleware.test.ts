import { NextFunction, Request, Response } from 'express';
import { PaginationMiddleware, RequestWithPagination } from './pagination.middleware';

const req = {} as Request;
const res = {} as Response;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const next: NextFunction = () => {};

describe('paginationMiddleware', () => {
  let middleware: PaginationMiddleware;

  beforeEach(async () => {
    middleware = new PaginationMiddleware();
  });

  describe('pagination use', () => {
    it('should return request with both skip and limit undefined', () => {
      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toStrictEqual({
        skip: undefined,
        limit: undefined,
      });
    });

    it('should return request with skip defined and limit undefined', () => {
      req.query = {
        skip: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toStrictEqual({
        skip: 1,
        limit: undefined,
      });
    });

    it('should return request with skip undefined and limit defined', () => {
      req.query = {
        limit: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toStrictEqual({
        skip: undefined,
        limit: 1,
      });
    });

    it('should return request with both skip and limit defined', () => {
      req.query = {
        skip: '1',
        limit: '1',
      };

      middleware.use(req, res, next);

      expect((req as RequestWithPagination).pagination).toStrictEqual({
        skip: 1,
        limit: 1,
      });
    });
  });
});
