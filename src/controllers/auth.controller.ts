import { Request } from 'express';
import { BaseHttpController, controller, httpPost, request } from 'inversify-express-utils';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { OctokitService } from '../services/octokit.service';

@controller('/auth')
export class AuthController extends BaseHttpController {
  constructor(private octokitService: OctokitService) {
    super();
  }

  @httpPost('/')
  async auth(@request() req: Request) {
    const { code } = req.body as { code: string };
    if (!code) {
      throw new LogicError(ErrorCode.AuthNo);
    }

    const response = await this.octokitService.getTokenByCode(code);
    if (typeof response === 'string') {
      throw new LogicError(ErrorCode.AuthExpired, response);
    }

    return this.json({ accessToken: response }, 200);
  }
}
