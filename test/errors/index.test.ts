import { extractHttpError, SerializedError, serializeError } from '../../src/errors';
import { ErrorCode } from '../../src/errors/codes';
import { LogicError } from '../../src/errors/logic.error';
import { AxiosError, AxiosResponse } from 'axios';

describe('errors lib functions test', () => {
  const error = new LogicError(ErrorCode.JsonBad, 'test');

  describe('toJsonObject test', () => {
    it('with debug on', () => {
      expect.hasAssertions();

      const serializedError = error.toJsonObject(true);

      expect(serializedError).toStrictEqual(
        expect.objectContaining({
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: ErrorCode.JsonBad,
        })
      );
    });

    it('with debug off', () => {
      expect.hasAssertions();

      const serializedError = error.toJsonObject(false);

      expect(serializedError).toStrictEqual(
        expect.objectContaining({
          message: error.message,
          code: ErrorCode.JsonBad,
        })
      );
    });
  });

  describe('serializeError function', () => {
    it('no error passed', () => {
      expect.hasAssertions();

      const result = serializeError(undefined);

      expect(result).toStrictEqual({});
    });
  });

  describe('extractHttpError function', () => {
    it('with request', () => {
      expect.hasAssertions();

      const protocol = 'http';
      const host = 'example.com';
      const path = '/path';
      const url = 'http//example.com/path';
      const method = 'GET';
      const headers = 'headers';
      const body = 'data';

      const serializedError: SerializedError = {
        http: {
          request: {
            url,
            protocol,
            host,
            path,
            method,
            getHeaders: () => headers,
          } as AxiosError['request'],
          response: {
            data: body,
            headers: {},
          } as AxiosResponse,
        },
      };
      const httpError = extractHttpError(serializedError['http']);

      expect(httpError).toStrictEqual(
        expect.objectContaining({
          request: {
            headers,
            method,
            url,
          },
          response: {
            body,
            headers: serializedError.http?.response?.headers,
          },
        })
      );
    });
  });
});
