import { RequestError } from '@octokit/request-error';
import { ErrorRequestHandler } from 'express';
import { ErrorCode } from '../../errors/codes';
import { LogicError } from '../../errors/logic.error';
import { ServerError } from '../../errors/server.error';
import { isNotProduction } from '../../lib/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof LogicError) {
    switch (error.code) {
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
  } else {
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      res
        .status(400)
        .json(new LogicError(ErrorCode.JsonBad, error.message).toJsonObject(isNotProduction()));
    } else if (error instanceof RequestError && error.status === 404) {
      res
        .status(404)
        .json(
          new LogicError(
            ErrorCode.NotFound,
            error.response && isRequestErrorDataMessage(error.response.data)
              ? error.response.data.message
              : error.message
          ).toJsonObject(isNotProduction())
        );
    } else {
      res.status(500).json(new ServerError(ErrorCode.Server).toJsonObject(isNotProduction()));
    }
  }

  if (Math.floor(res.statusCode / 100) === 5) {
    console.error(`Error occurred at '${req.url}', ${error}`);
  } else {
    console.debug(`Request error at '${req.url}': ${error}`);
  }
};

function isRequestErrorDataMessage(
  octokitResponseData: any
): octokitResponseData is Record<string, string> {
  return (
    octokitResponseData &&
    'message' in octokitResponseData &&
    typeof octokitResponseData.message === 'string'
  );
}
