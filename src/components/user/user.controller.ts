import { Controller, Get, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { getTokenFromRequest } from '../../lib/auth';
import { OctokitService } from '../octokit/octokit.service';
import { ApiTags as Tags } from '../../lib/swagger';

@ApiBearerAuth('Bearer')
@ApiTags(Tags.USER)
@Controller('/user')
export class UserController {
  constructor(private readonly octokitService: OctokitService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a user',
    description: 'Get a Github user by their access token (bearer token)',
    operationId: 'getUser',
  })
  @ApiOkResponse({
    description: 'The user is acquired',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            login: {
              type: 'string',
            },
            id: {
              type: 'number',
            },
            node_id: {
              type: 'string',
            },
            avatar_url: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUser(@Req() req: Request) {
    const token = getTokenFromRequest(req);

    const user = await this.octokitService.getUserByToken(token);

    return user;
  }
}
