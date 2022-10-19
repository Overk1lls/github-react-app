import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ApiTags as Tags } from '../../lib/swagger';
import { OctokitService } from '../octokit/octokit.service';

@ApiTags(Tags.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly octokitService: OctokitService) {}

  @Post()
  @ApiOperation({
    summary: 'Authorize a user',
    description: 'Authorize a user and get an access token via a Github account',
    operationId: 'authorize',
  })
  @ApiOkResponse({
    description: 'User is successfully authorized!',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'object',
              properties: {
                access_token: {
                  type: 'string',
                },
                token_type: {
                  type: 'string',
                },
                scope: {
                  type: 'string',
                },
              },
              required: ['access_token'],
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                },
                login: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                location: {
                  type: 'string',
                },
                html_url: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
          },
          required: ['accessToken', 'user'],
        },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'The code passed is incorrect or expired' })
  @ApiBody({
    description: 'A code provided by Github',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
        },
      },
    },
  })
  async auth(@Body('code') code: string) {
    const accessToken = await this.octokitService.getTokenByCode(code);

    return { accessToken: accessToken.access_token };
  }
}
