import { Request, RequestHandler } from 'express';
import { getPaginateParamsFromQuery } from '../../lib/utils';
import { Paginate } from '../../services/octokit.service';

export interface RequestWithPaginate extends Request {
  paginate: Paginate;
}

export const paginateHandler: RequestHandler = (req, res, next) => {
  const paginate = getPaginateParamsFromQuery(req);
  const request = req as RequestWithPaginate;

  request.paginate = paginate;

  next();
};
