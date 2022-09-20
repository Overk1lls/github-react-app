import { AxiosError } from 'axios';
import { as, NonOptimal, SerializePropertyValue } from '../lib/types';
import { ErrorCode } from './codes';

export interface SerializedError {
  name?: Error['name'];
  message?: Error['message'];
  stack?: Error['stack'];
  code?: ErrorCode;
  cause?: SerializedError;
  http?: {
    request?: {
      url: string;
      method?: string;
      headers?: Record<string, string>;
    };
    response?: {
      body?: ErrorResponse['data'];
      headers?: Record<string, string>;
    };
  };
  [property: string]: any;
}

type ErrorResponse = NonOptimal<AxiosError['response']>;

export const includeHttp: unique symbol = Symbol('serializeError.http');

export type ErrorSerializationProperties = Record<string, SerializePropertyValue | boolean> & {
  name?: SerializePropertyValue | boolean;
  message?: SerializePropertyValue | boolean;
  stack?: SerializePropertyValue | boolean;
  code?: SerializePropertyValue | boolean;
  cause?: SerializePropertyValue | boolean;
  [includeHttp]: boolean | string;
};

export function serializeError(error: any, properties?: ErrorSerializationProperties) {
  const serialized: SerializedError = {};
  if (!error) {
    return serialized;
  }

  const props: ErrorSerializationProperties = Object.assign(
    { message: true, code: true },
    properties
  );

  if (props[includeHttp]) {
    props[includeHttp] = 'http';
  }

  if (typeof props[includeHttp] === 'string') {
    const property = props[includeHttp] as string;
    if (props[property]) {
      throw new TypeError(
        `HTTP error serialization conflict: output property "${props[includeHttp]}" mentioned in the config.`
      );
    }
    serialized[property] = extractHttpError(error);
  }

  if (props.cause) {
    if (!error.cause) {
      props.cause = false;
    } else {
      props.cause = (value) => serializeError(value, properties);
    }
  }

  for (const [key, value] of Object.entries(props)) {
    if (!value) {
      continue;
    }
    if (typeof value === 'function') {
      serialized[key] = value(error[key], error, key);
    } else {
      serialized[key] = error[key];
    }
  }
  return serialized;
}

export function extractHttpError(error: any) {
  if (error.response || error.request) {
    const http: SerializedError['http'] = {};

    if (error.request) {
      const req = error.request as AxiosError['request'];
      http.request = {
        url: req.protocol + '//' + req.host + req.path,
      };
      if ('method' in req) {
        http.request.method = req.method;
      }
      if (typeof req.getHeaders === 'function') {
        http.request.headers = req.getHeaders();
      }
    }
    if (error.response && as<ErrorResponse>(error.response)) {
      const response = {} as NonOptimal<NonOptimal<SerializedError['http']>['response']>;
      let isResponseEmpty = true;

      if ('data' in error.response) {
        response.body = error.response.data;
        isResponseEmpty = false;
      }
      if ('headers' in error.response) {
        response.headers = error.response.headers;
        isResponseEmpty = false;
      }
      if (!isResponseEmpty) {
        http.response = response;
      }
    }
    return http;
  }
}
