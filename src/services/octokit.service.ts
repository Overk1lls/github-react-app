import { Octokit } from 'octokit';
import { config } from '../lib/config';
import { inject, injectable } from 'inversify';
import { types } from '../di/types';
import type { GithubData } from '../models/github-data';
import type { Optimal } from '../lib/types';
import type { OctokitResponse, Endpoints } from '@octokit/types';
import type { PaginatingEndpoints } from '@octokit/plugin-paginate-rest';
import type { PaginationResults } from '@octokit/plugin-paginate-rest/dist-types/types';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = config;

export interface Paginate {
  skip?: number;
  limit?: number;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

@injectable()
export class OctokitService {
  private octokit: Octokit;

  constructor(
    @inject<Optimal<string>>(types.OctokitToken)
    token?: string
  ) {
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

  getReposByOrg(org: string, paginate?: Paginate) {
    return this.getRepoData('GET /orgs/{org}/repos', { org, ...paginate });
  }

  getRepoCommits(owner: string, repo: string, paginate?: Paginate) {
    return this.getRepoData('GET /repos/{owner}/{repo}/commits', { owner, repo, ...paginate });
  }

  getRepoBranches(owner: string, repo: string, paginate?: Paginate) {
    return this.getRepoData('GET /repos/{owner}/{repo}/branches', { owner, repo, ...paginate });
  }

  async getRepoData(route: keyof PaginatingEndpoints, data: GithubData & Paginate) {
    const { owner, repo, org, skip, limit } = data;

    const response = await this.octokit.paginate(
      route,
      {
        owner,
        repo,
        org,
        per_page: skip,
        page: skip ? 2 : undefined,
      },
      paginateMapFn<Endpoints[typeof route]>(limit)
    );
    return response;
  }

  async getTokenByCode(code: string): Promise<AccessTokenResponse | string> {
    const { data } = await this.octokit.request(
      `POST https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    );
    if (data?.error) {
      return data?.error_description as string;
    }
    return data as AccessTokenResponse;
  }

  async getUserByToken(token: string) {
    const { data } = await this.octokit.request('GET /user', {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  }
}

export function paginateMapFn<T>(limit: Optimal<number>) {
  return (
    response: OctokitResponse<PaginationResults<['response'] extends keyof T ? T : unknown>>,
    done: () => void
  ) => {
    const { data } = response;
    let count = 0;

    if (limit) {
      count += data.length;

      if (count >= limit) {
        done();
      }
      return data.slice(0, limit);
    }
    return data;
  };
}
