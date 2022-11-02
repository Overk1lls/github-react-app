import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { OctokitService } from '../services/octokit.service';

@controller('/auth')
export class AuthController extends BaseHttpController {
  constructor(private octokitService: OctokitService) {
    super();
  }

  @httpPost('/')
  async auth(@requestBody() body: Record<string, any>) {
    const { code } = body as { code?: string };
    if (!code) {
      throw new LogicError(ErrorCode.AuthNo);
    }

    const response = await this.octokitService.getTokenByCode(code);

    return this.json({ accessToken: response }, 200);
  }
}
