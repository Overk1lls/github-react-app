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
    const property = props[includeHttp];
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
      http.request = extractErrorRequest(error);
    }
    if (error.response && as<ErrorResponse>(error.response)) {
      http.response = extractErrorResponse(error);
    }
    return http;
  }
}

function extractErrorRequest(error: any) {
  const { request } = error;
  return {
    url: request.protocol + '//' + request.host + request.path,
    method: request.method,
    headers: typeof request.getHeaders === 'function' ? request.getHeaders() : undefined,
  };
}

function extractErrorResponse(error: any) {
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
  return isResponseEmpty ? undefined : response;
}
