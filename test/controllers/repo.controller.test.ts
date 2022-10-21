import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { OctokitService } from '../../src/components/octokit/octokit.service';
import { RepoController } from '../../src/components/repo/repo.controller';
import { mockBranches, mockCommits, mockRepos, mockToken } from '../__mock__';

describe('RepoController', () => {
  let repoController: RepoController;
  let octokitService: OctokitService;

  const req = {
    headers: {
      authorization: 'Bearer ' + mockToken,
    },
  } as Request;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RepoController],
      providers: [OctokitService],
    }).compile();

    octokitService = moduleRef.get<OctokitService>(OctokitService);
    repoController = moduleRef.get<RepoController>(RepoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReposByOrg', () => {
    test('should return a list of repos', async () => {
      jest.spyOn(octokitService, 'getReposByOrg').mockResolvedValue(mockRepos);

      const result = await repoController.getReposByOrg(req, 'org', {});

      expect(result).toEqual(expect.arrayContaining(mockRepos));
      expect(octokitService.getReposByOrg).toHaveBeenCalledWith(mockToken, 'org', {});
    });
  });

  describe('getRepoBranches', () => {
    test('should return a list of branches', async () => {
      jest.spyOn(octokitService, 'getRepoBranches').mockResolvedValue(mockBranches);

      const result = await repoController.getRepoBranches(req, 'owner', 'repo', {});

      expect(result).toEqual(expect.arrayContaining(mockBranches));
      expect(octokitService.getRepoBranches).toHaveBeenCalledWith(
        mockToken,
        { owner: 'owner', repo: 'repo' },
        {}
      );
    });
  });

  describe('getRepoCommits', () => {
    test('should return a list of commits', async () => {
      jest.spyOn(octokitService, 'getRepoCommits').mockResolvedValue(mockCommits);

      const result = await repoController.getRepoCommits(req, 'owner', 'repo', {});

      expect(result).toEqual(expect.arrayContaining(mockCommits));
      expect(octokitService.getRepoCommits).toHaveBeenCalledWith(
        mockToken,
        { owner: 'owner', repo: 'repo' },
        {}
      );
    });
  });
});
