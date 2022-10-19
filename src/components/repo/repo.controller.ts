import { Controller, Get, Req, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { getTokenFromRequest } from '../../lib/auth';
import { OctokitService } from '../octokit/octokit.service';
import { ApiTags as Tags } from '../../lib/swagger';
import { PaginationDto } from '../../common/models';

@ApiBearerAuth('Bearer')
@Controller('/repos')
export class RepoController {
  constructor(private readonly octokitService: OctokitService) {}

  @Get('/by-org/:org')
  @ApiTags(Tags.REPO)
  @ApiOperation({
    summary: 'Get a list of repositories',
    description: 'Get a list of repositories of an organization by its name',
    operationId: 'getReposByOrg',
  })
  @ApiOkResponse({
    description: 'The list of users is acquired',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              name: {
                type: 'string',
              },
              full_name: {
                type: 'string',
              },
              private: {
                type: 'boolean',
              },
              url: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              language: {
                type: 'string',
              },
              stargazers_count: {
                type: 'number',
              },
              watchers_count: {
                type: 'number',
              },
              forks: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'The organization is not found' })
  async getReposByOrg(
    @Req() req: Request,
    @Param('org') org: string,
    @Query() pagination: PaginationDto
  ) {
    const token = getTokenFromRequest(req);

    const repos = await this.octokitService.getReposByOrg(token, org, pagination);

    return repos;
  }

  @Get('/by-owner/:owner/:repo/branches')
  @ApiTags(Tags.BRANCH)
  @ApiOperation({
    summary: 'Get a list of branches',
    description: "Get a list of some repository's branches by the owner and its name",
    operationId: 'getRepoBranches',
  })
  @ApiOkResponse({
    description: 'The list of branches is acquired',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              commit: {
                type: 'object',
                properties: {
                  sha: {
                    type: 'string',
                  },
                  url: {
                    type: 'string',
                  },
                },
              },
              protected: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'The repository is not found with these parameters' })
  async getRepoBranches(
    @Req() req: Request,
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query() pagination: PaginationDto
  ) {
    const token = getTokenFromRequest(req);

    const branches = await this.octokitService.getRepoBranches(token, { owner, repo }, pagination);

    return branches;
  }

  @Get('/by-owner/:owner/:repo/commits')
  @ApiTags(Tags.COMMIT)
  @ApiOperation({
    summary: 'Get a list of commits',
    description: 'Get a list of commits of some repository branch by the owner and its name',
    operationId: 'getRepoCommits',
  })
  @ApiOkResponse({
    description: 'The list of commits is acquired',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sha: {
                type: 'string',
              },
              node_id: {
                type: 'string',
              },
              url: {
                type: 'string',
              },
              html_url: {
                type: 'string',
              },
              comments_url: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'The repository is not found with these parameters' })
  async getRepoCommits(
    @Req() req: Request,
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query() pagination: PaginationDto
  ) {
    const token = getTokenFromRequest(req);

    const commits = await this.octokitService.getRepoCommits(token, { owner, repo }, pagination);

    return commits;
  }
}
