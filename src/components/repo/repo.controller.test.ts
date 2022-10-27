import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Request } from 'express';
import { OctokitService } from '../octokit/octokit.service';
import { RepoController } from './repo.controller';
import { mockBranches, mockCommits, mockRepos, mockToken } from '../../../test/__mock__';
import { githubConfig } from '../../lib/config';

describe('repoController', () => {
  let repoController: RepoController;
  let octokitService: OctokitService;

  const req = {
    headers: {
      authorization: 'Bearer ' + mockToken,
    },
  } as Request;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [githubConfig],
        }),
      ],
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
    it('should return a list of repos', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService, 'getReposByOrg').mockResolvedValue(mockRepos);

      const result = await repoController.getReposByOrg(req, 'org', {});

      expect(result).toStrictEqual(expect.arrayContaining(mockRepos));
      expect(octokitService.getReposByOrg).toHaveBeenCalledWith(mockToken, 'org', {});
    });
  });

  describe('getRepoBranches', () => {
    it('should return a list of branches', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService, 'getRepoBranches').mockResolvedValue(mockBranches);

      const result = await repoController.getRepoBranches(req, 'owner', 'repo', {});

      expect(result).toStrictEqual(expect.arrayContaining(mockBranches));
      expect(octokitService.getRepoBranches).toHaveBeenCalledWith(
        mockToken,
        { owner: 'owner', repo: 'repo' },
        {}
      );
    });
  });

  describe('getRepoCommits', () => {
    it('should return a list of commits', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService, 'getRepoCommits').mockResolvedValue(mockCommits);

      const result = await repoController.getRepoCommits(req, 'owner', 'repo', {});

      expect(result).toStrictEqual(expect.arrayContaining(mockCommits));
      expect(octokitService.getRepoCommits).toHaveBeenCalledWith(
        mockToken,
        { owner: 'owner', repo: 'repo' },
        {}
      );
    });
  });
});
