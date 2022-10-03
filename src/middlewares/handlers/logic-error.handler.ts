import { ErrorRequestHandler } from 'express';
import { LogicError } from '../../errors/logic.error';
import { ErrorCode } from '../../errors/codes';
import { isNotProduction } from '../../lib/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logicErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof LogicError) {
    switch (error.code) {
      case ErrorCode.AuthNo:
      case ErrorCode.AuthBadScheme:
        res.status(401);
        break;

      case ErrorCode.AuthExpired:
        res.status(403);
        break;

      case ErrorCode.NotFound:
        res.status(404);
        break;

      default:
        res.status(400);
        break;
    }
    res.json(error.toJsonObject(isNotProduction()));
    console.debug(`Request error at '${req.url}': ${error}`);
  } else {
    next(error);
  }
};
