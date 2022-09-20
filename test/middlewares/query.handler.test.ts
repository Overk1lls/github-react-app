import { Response, NextFunction } from 'express';
import { paginateHandler } from '../../src/middlewares/handlers/query.handler';
import { createRequest } from 'node-mocks-http';

it('queryPaginateHandler', () => {
  const mockRequest = createRequest({
    paginate: {
      skip: undefined,
      limit: undefined,
    },
  });
  const mockResponse: Partial<Response> = {};
  const mockNextFn: NextFunction = jest.fn();

  paginateHandler(mockRequest, mockResponse as Response, mockNextFn);

  expect(mockNextFn).toBeCalledTimes(1);
});
