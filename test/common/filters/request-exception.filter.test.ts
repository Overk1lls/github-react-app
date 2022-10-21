import { Test } from '@nestjs/testing';
import { RequestError } from '@octokit/request-error';
import { RequestExceptionsFilter } from '../../../src/common/filters/request-exception.filter';

const mockJson = jest.fn();

const mockStatus = jest.fn(() => ({
  json: mockJson,
}));

const mockGetResponse = jest.fn(() => ({
  status: mockStatus,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

describe('RequestExceptionsFilter', () => {
  let filter: RequestExceptionsFilter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RequestExceptionsFilter],
    }).compile();

    filter = moduleRef.get<RequestExceptionsFilter>(RequestExceptionsFilter);
  });

  test('should first', () => {
    const error: RequestError = new RequestError('Bad credentials', 401, {
      request: {
        method: 'GET',
        url: '',
        headers: {},
      },
    });

    filter.catch(error, {
      switchToHttp: mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    });

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(error.status);
    expect(mockJson).toHaveBeenCalledWith({
      message: error.message,
      statusCode: error.status,
    });
  });
});
