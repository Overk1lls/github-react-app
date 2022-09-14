import { Request } from 'express';
import { getTokenFromRequest } from '../lib/auth';
import { OctokitService } from '../services/octokit.service';
import { BaseHttpController, controller, httpGet, request } from 'inversify-express-utils';

@controller('/user')
export class UserController extends BaseHttpController {
  constructor(private octokitService: OctokitService) {
    super();
  }

  @httpGet('/')
  async getUser(@request() req: Request) {
    const token = getTokenFromRequest(req);
    const user = await this.octokitService.getUserByToken(token);

    return this.json(user, 200);
  }
}
