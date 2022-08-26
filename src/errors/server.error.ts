import { ServerErrorCode } from "./codes";
import { LogicError } from "./logic.error";

export class ServerError extends LogicError {
  constructor(code: ServerErrorCode, message?: string) {
    super(code, message);
  }
}