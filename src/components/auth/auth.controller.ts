import { Controller, Post, Body } from '@nestjs/common';
import { OctokitService } from '../octokit/octokit.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly octokitService: OctokitService) {}

  @Post()
  async auth(@Body('code') code: string) {
    const accessToken = await this.octokitService.getTokenByCode(code);

    return { accessToken: accessToken.access_token };
  }
}
