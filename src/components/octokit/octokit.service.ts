import { Injectable, Inject, Optional, ForbiddenException } from '@nestjs/common';
import { PaginationResults } from '@octokit/plugin-paginate-rest/dist-types/types';
import { OctokitResponse } from '@octokit/types';
import { Octokit } from 'octokit';
import { AccessTokenResponse, Pagination } from '../../common/models';
import { GithubRepoData } from '../../common/models/github-data';
import { config } from '../../lib/config';

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = config;

interface RequestTokenError {
  error: any;
  error_description: string;
}

@Injectable()
export class OctokitService {
  private readonly octokit: Octokit;

  constructor(@Optional() @Inject<string>() token?: string) {
    this.octokit = new Octokit({
      auth: token,
      log: {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
      },
    });
  }

  get getOctokit(): Octokit {
    return this.octokit;
  }

  async getTokenByCode(code: string) {
    const { data } = await this.octokit.request<AccessTokenResponse | RequestTokenError, any>(
      `POST https://github.com/login/oauth/access_token?client_id=${AUTH_CLIENT_ID}&client_secret=${AUTH_CLIENT_SECRET}&code=${code}`
    );
    if ('error' in data) {
      throw new ForbiddenException(data.error, data.error_description);
    }
    return data;
  }

  async getUserByToken(token: string) {
    const { data } = await this.octokit.request('GET /user', {
      headers: {
        authorization: `token ${token}`,
      },
    });
    return data;
  }

  async getReposByOrg(token: string, org: string, pagination: Pagination) {
    const repos = await this.octokit.paginate(
      this.octokit.rest.repos.listForOrg,
      {
        org,
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      paginationMapFn(pagination)
    );
    return repos;
  }

  getRepoCommits(token: string, data: GithubRepoData, pagination: Pagination) {
    return this.octokit.paginate(
      this.octokit.rest.repos.listCommits,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        owner: data.owner,
        repo: data.repo,
      },
      paginationMapFn(pagination)
    );
  }

  getRepoBranches(token: string, data: GithubRepoData, pagination: Pagination) {
    return this.octokit.paginate(
      this.octokit.rest.repos.listBranches,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        owner: data.owner,
        repo: data.repo,
      },
      paginationMapFn(pagination)
    );
  }
}

export function paginationMapFn<T>(pagination: Pagination) {
  return (response: OctokitResponse<PaginationResults<T>>, done: () => void) => {
    const { data } = response;
    const { limit, skip } = pagination;
    const startIdx = skip ?? 0;
    let count = 0;

    if (limit) {
      count += data.length;

      if (count >= limit) {
        done();
      }
      return data.slice(startIdx, startIdx + limit);
    }
    return data.slice(startIdx);
  };
}
