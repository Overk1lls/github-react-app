import { Octokit } from "octokit";
import { PaginatingEndpoints } from "@octokit/plugin-paginate-rest";
import { ErrorCode } from "../errors/codes";
import { LogicError } from "../errors/logic.error";
import { config } from "../lib/config";
import { GithubData } from "../models/github-data";

const { githubClientId, githubClientSecret, githubToken } = config;

export interface Paginate {
  skip?: number;
  limit?: number;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export class OctokitService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: githubToken,
      log: {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
      },
    });
  }

  getRepositoriesByOrg(organization: string, paginate?: Paginate) {
    return this.getRepoData('GET /orgs/{org}/repos', { organization }, paginate);
  }

  getRepositoryCommits(owner: string, repository: string, paginate?: Paginate) {
    return this.getRepoData('GET /repos/{owner}/{repo}/commits', { owner, repository }, paginate);
  }

  getRepositoryBranches(owner: string, repository: string, paginate?: Paginate) {
    return this.getRepoData('GET /repos/{owner}/{repo}/branches', { owner, repository }, paginate);
  }

  private async getRepoData(
    route: keyof PaginatingEndpoints,
    data: GithubData,
    paginate?: Paginate
  ) {
    const { owner, repository: repo, organization: org } = data;
    let count = 0;

    let obj = {
      per_page: 0,
      page: 0,
    };
    // if (paginate?.limit && !paginate?.skip) {
    //   obj.per_page = paginate.limit;
    //   obj.page = 1;
    // } else if (!paginate?.limit && paginate?.skip) {

    // }

    const response = await this.octokit.paginate(route, {
      owner,
      repo,
      org,
      per_page: paginate?.skip,
      page: paginate?.skip ? 2 : undefined,
    }, (response, done) => {
      const { data } = response;

      if (paginate?.limit) {
        count += data.length;

        if (count >= paginate.limit) {
          done();
        }
        return data.slice(0, paginate.limit);
      }
      return data;
    });
    return response;
  }

  async getAccessTokenByCode(code: string): Promise<AccessTokenResponse> {
    const { data } = await this.octokit.request(
      `POST https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${code}`
    );
    if (data?.error) {
      throw new LogicError(ErrorCode.AuthExpired, data.error_description);
    }
    return data as AccessTokenResponse;
  }

  // #TODO: If user is not found
  async getUserFromAccessToken(token: string) {
    const { data } = await this.octokit.request('GET /user', {
      headers: {
        Authorization: `token ${token}`
      }
    });
    return data;
  }
}