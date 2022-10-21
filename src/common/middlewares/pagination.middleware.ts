import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../models';

export interface RequestWithPagination extends Request {
  pagination: Pagination;
}

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const pagination = getPaginationParamsFromQuery(req);
    const request = req as RequestWithPagination;

    request.pagination = pagination;

    next();
  }
}

function getPaginationParamsFromQuery(req: Request): Pagination {
  return {
    skip: req.query?.skip ? parseInt(req.query.skip.toString()) : undefined,
    limit: req.query?.limit ? parseInt(req.query.limit.toString()) : undefined,
  };
}
