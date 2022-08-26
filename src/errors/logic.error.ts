import { ErrorSerializationProperties, includeHttp, SerializedError, serializeError } from ".";
import { ErrorCode } from "./codes";

export interface ILogicError {
  code: ErrorCode;
}

export class LogicError extends TypeError implements ILogicError {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }

  toJsonObject(debug = false): SerializedError {
    return serializeError(this, getErrorSerializationProperties(debug));
  }
}

export function getErrorSerializationProperties(debug: boolean): ErrorSerializationProperties {
  return {
    name: debug,
    stack: debug,
    cause: debug,
    message: debug,
    [includeHttp]: debug,
  };
}