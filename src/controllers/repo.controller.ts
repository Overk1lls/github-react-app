import { Request } from 'express';
import {
  controller,
  httpGet,
  request,
  BaseHttpController,
  requestParam,
} from 'inversify-express-utils';
import { Parameters } from '../lib/const';
import { paginateHandler, RequestWithPaginate } from '../middlewares/handlers/query.handler';
import { OctokitService } from '../services/octokit.service';

@controller('/repos')
export class RepoController extends BaseHttpController {
  constructor(private readonly octokitService: OctokitService) {
    super();
  }

<<<<<<< HEAD
=======
  public get octokit(): OctokitService {
    return this.octokitService;
  }

>>>>>>> 65814b5 (Dependency Injection support add)
  @httpGet(`/by-org/:${Parameters.Org}`, paginateHandler)
  async getRepos(@request() req: Request, @requestParam(Parameters.Org) org: string) {
    const { paginate } = req as RequestWithPaginate;
    const repos = await this.octokitService.getReposByOrg(org, paginate);

<<<<<<< HEAD
    return this.json({ repositories: repos }, 200);
=======
    return this.json(repos, 200);
>>>>>>> 65814b5 (Dependency Injection support add)
  }

  @httpGet(`/by-owner/:${Parameters.Owner}/:${Parameters.Repo}/commits`, paginateHandler)
  async getRepoCommits(
    @request() req: Request,
    @requestParam(Parameters.Owner) owner: string,
    @requestParam(Parameters.Repo) repo: string
  ) {
    const { paginate } = req as RequestWithPaginate;
    const commits = await this.octokitService.getRepoCommits(owner, repo, paginate);

<<<<<<< HEAD
    return this.json({ commits }, 200);
=======
    return this.json(commits, 200);
>>>>>>> 65814b5 (Dependency Injection support add)
  }

  @httpGet(`/by-owner/:${Parameters.Owner}/:${Parameters.Repo}/branches`, paginateHandler)
  async getRepoBranches(
    @request() req: Request,
    @requestParam(Parameters.Owner) owner: string,
    @requestParam(Parameters.Repo) repo: string
  ) {
    const { paginate } = req as RequestWithPaginate;
    const branches = await this.octokitService.getRepoBranches(owner, repo, paginate);

<<<<<<< HEAD
    return this.json({ branches }, 200);
=======
    return this.json(branches, 200);
>>>>>>> 65814b5 (Dependency Injection support add)
  }
}
