import { Controller, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { RequestWithPagination } from '../../common/middlewares/paginate.middleware';
import { getTokenFromRequest } from '../../lib/auth';
import { OctokitService } from '../octokit/octokit.service';

@Controller('/repos')
export class RepoController {
  constructor(private readonly octokitService: OctokitService) {}

  @Get('/by-org/:org')
  async getReposByOrg(@Req() req: Request, @Param('org') org: string) {
    const { pagination } = req as RequestWithPagination;
    const token = getTokenFromRequest(req);

    const repos = await this.octokitService.getReposByOrg(token, org, pagination);

    return repos;
  }

  @Get('/by-owner/:owner/:repo/branches')
  async getRepoBranches(
    @Req() req: Request,
    @Param('owner') owner: string,
    @Param('repo') repo: string
  ) {
    const { pagination } = req as RequestWithPagination;
    const token = getTokenFromRequest(req);

    const branches = await this.octokitService.getRepoBranches(token, { owner, repo }, pagination);

    return branches;
  }

  @Get('/by-owner/:owner/:repo/commits')
  async getRepoCommits(
    @Req() req: Request,
    @Param('owner') owner: string,
    @Param('repo') repo: string
  ) {
    const { pagination } = req as RequestWithPagination;
    const token = getTokenFromRequest(req);

    const commits = await this.octokitService.getRepoCommits(token, { owner, repo }, pagination);

    return commits;
  }
}
