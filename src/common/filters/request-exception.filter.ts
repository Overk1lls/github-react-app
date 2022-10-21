import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RequestError } from '@octokit/request-error';
import { Response } from 'express';

@Catch(RequestError)
export class RequestExceptionsFilter implements ExceptionFilter {
  catch(exception: RequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const { status, message } = exception;

    res.status(status).json({
      message,
      statusCode: status,
    });
  }
}
