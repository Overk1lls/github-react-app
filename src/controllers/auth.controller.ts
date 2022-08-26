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
<<<<<<< HEAD
    const { code }: { code: string } = req.body;
=======
    const { code } = req.body as { code: string };
>>>>>>> 65814b5 (Dependency Injection support add)
    if (!code) {
      throw new LogicError(ErrorCode.AuthNo);
    }

    const response = await this.octokitService.getTokenByCode(code);
    if (typeof response === 'string') {
      throw new LogicError(ErrorCode.AuthExpired, response);
    }

<<<<<<< HEAD
    this.json({ accessToken: response }, 200);
=======
    return this.json({ accessToken: response }, 200);
>>>>>>> 65814b5 (Dependency Injection support add)
  }
}
