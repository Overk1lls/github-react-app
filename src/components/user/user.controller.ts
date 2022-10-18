import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { getTokenFromRequest } from '../../lib/auth';
import { OctokitService } from '../octokit/octokit.service';

@Controller('/user')
export class UserController {
  constructor(private readonly octokitService: OctokitService) {}

  @Get('/')
  async getUser(@Req() req: Request) {
    const token = getTokenFromRequest(req);

    const user = await this.octokitService.getUserByToken(token);

    return user;
  }
}
