import 'reflect-metadata';
import { OctokitService } from '../../src/services/octokit.service';
import { RepoController } from '../../src/controllers/repo.controller';
import { mockData, mockOrgName, mockRepoName } from '../__mock__/index';
import { createRequest } from 'node-mocks-http';

describe('RepoController', () => {
  const octokitService = new OctokitService();
  const repoController = new RepoController(octokitService);

  const req = createRequest({
    paginate: {},
  });

  it('getRepos', async () => {
    const spyOnReposRoute = jest
      .spyOn(repoController.octokit, 'getReposByOrg')
      .mockResolvedValue(mockData);

    const { json } = await repoController.getRepos(req, mockOrgName);

    expect(json).toEqual(expect.arrayContaining(mockData));
    expect(spyOnReposRoute).toHaveBeenLastCalledWith(mockOrgName, req.paginate);

    spyOnReposRoute.mockClear();
    spyOnReposRoute.mockRestore();
  });

  it('getRepoCommits', async () => {
    const spyOnCommitsRoute = jest
      .spyOn(repoController.octokit, 'getRepoCommits')
      .mockResolvedValue(mockData);

    const { json } = await repoController.getRepoCommits(req, mockOrgName, mockRepoName);

    expect(json).toEqual(expect.arrayContaining(mockData));
    expect(spyOnCommitsRoute).toHaveBeenLastCalledWith(mockOrgName, mockRepoName, req.paginate);

    spyOnCommitsRoute.mockClear();
    spyOnCommitsRoute.mockRestore();
  });

  it('getRepoBranches', async () => {
    const spyOnBranchesRoute = jest
      .spyOn(repoController.octokit, 'getRepoBranches')
      .mockResolvedValue(mockData);

    const { json } = await repoController.getRepoBranches(req, mockOrgName, mockRepoName);

    expect(json).toEqual(expect.arrayContaining(mockData));
    expect(spyOnBranchesRoute).toHaveBeenLastCalledWith(mockOrgName, mockRepoName, req.paginate);

    spyOnBranchesRoute.mockClear();
    spyOnBranchesRoute.mockRestore();
  });
});
