import 'reflect-metadata';
import { OctokitService } from '../../src/services/octokit.service';
import { RepoController } from '../../src/controllers/repo.controller';
import { mockData, mockOrgName, mockRepoName } from '../__mock__/index';
import { createRequest } from 'node-mocks-http';

let octokitService: OctokitService;
let repoController: RepoController;

describe('repoController', () => {
  beforeEach(() => {
    octokitService = new OctokitService();
    repoController = new RepoController(octokitService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const req = createRequest({
    paginate: {},
  });

  it('getRepos', async () => {
    expect.assertions(2);

    jest.spyOn(repoController.octokit, 'getReposByOrg').mockResolvedValue(mockData);

    const { json } = await repoController.getRepos(req, mockOrgName);

    expect(json).toStrictEqual(expect.arrayContaining(mockData));
    expect(octokitService.getReposByOrg).toHaveBeenCalledWith(mockOrgName, req.paginate);
  });

  it('getRepoCommits', async () => {
    expect.assertions(2);

    jest.spyOn(repoController.octokit, 'getRepoCommits').mockResolvedValue(mockData);

    const { json } = await repoController.getRepoCommits(req, mockOrgName, mockRepoName);

    expect(json).toStrictEqual(expect.arrayContaining(mockData));
    expect(octokitService.getRepoCommits).toHaveBeenLastCalledWith(
      mockOrgName,
      mockRepoName,
      req.paginate
    );
  });

  it('getRepoBranches', async () => {
    expect.assertions(2);

    jest.spyOn(repoController.octokit, 'getRepoBranches').mockResolvedValue(mockData);

    const { json } = await repoController.getRepoBranches(req, mockOrgName, mockRepoName);

    expect(json).toStrictEqual(expect.arrayContaining(mockData));
    expect(octokitService.getRepoBranches).toHaveBeenLastCalledWith(
      mockOrgName,
      mockRepoName,
      req.paginate
    );
  });
});
