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
  const { skip, limit } = req.query;
  return {
    skip: skip ? parseInt(skip.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  };
}
