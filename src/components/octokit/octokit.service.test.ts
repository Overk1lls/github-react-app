/* eslint-disable @typescript-eslint/no-empty-function */

import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Octokit } from 'octokit';
import { OctokitResponse } from '@octokit/types';
import { PaginationResults } from '@octokit/plugin-paginate-rest/dist-types/types';
import { RequestError } from '@octokit/request-error';
import { ForbiddenException } from '@nestjs/common';
import { OctokitService, paginationMapFn } from './octokit.service';
import { AccessTokenResponse } from '../../common/models';
import { githubConfig } from '../../lib/config';
import {
  mockBranches,
  mockCode,
  mockCommits,
  mockErrorResponse,
  mockRepos,
  mockToken,
  mockTokenResponse,
  mockUser,
} from '../../../test/__mock__';

describe('octokitService', () => {
  let octokitService: OctokitService;
  let octokit: Octokit;

  const owner = 'owner';
  const repo = 'repo';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [githubConfig],
        }),
      ],
      providers: [OctokitService],
    }).compile();

    octokitService = moduleRef.get<OctokitService>(OctokitService);
    octokit = octokitService.getOctokit;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTokenByCode', () => {
    it('should return an access token', async () => {
      expect.assertions(2);

      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockTokenResponse,
      } as OctokitResponse<AccessTokenResponse, 200>);

      const result = await octokitService.getTokenByCode(mockCode);

      expect(result).toStrictEqual(expect.objectContaining(mockTokenResponse));
      expect(octokit.request).toHaveBeenCalledWith<[string]>(
        'POST https://github.com/login/oauth/access_token?client_id=undefined&client_secret=undefined&code=' +
          mockCode
      );
    });

    it('should throw ForbiddenException', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockErrorResponse,
      } as OctokitResponse<typeof mockErrorResponse, any>);

      const invokeFn = () => octokitService.getTokenByCode(mockCode);

      await expect(invokeFn).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUserByToken', () => {
    it('should return a user', async () => {
      expect.assertions(2);

      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockUser,
      } as OctokitResponse<typeof mockUser, 200>);

      const result = await octokitService.getUserByToken(mockToken);

      expect(result).toStrictEqual(expect.objectContaining(mockUser));
      expect(octokit.request).toHaveBeenCalledWith('GET /user', {
        headers: {
          authorization: `token ${mockToken}`,
        },
      });
    });
  });

  describe('getReposByOrg', () => {
    it('should return a list of repos', async () => {
      expect.assertions(2);

      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockRepos);

      const result = await octokitService.getReposByOrg(mockToken, 'org', {});

      expect(result).toStrictEqual(expect.arrayContaining(mockRepos));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockRepos));
    });

    it('should throw RequestError', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('Bad credentials', 401, {
          request: {
            method: 'GET',
            url: 'test',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getReposByOrg(mockToken, 'org', {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });

    it('should throw NotFound exception', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('NotFound', 404, {
          request: {
            method: 'GET',
            url: '1',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getReposByOrg(mockToken, 'org', {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });
  });

  describe('getRepoCommits', () => {
    it('should return a list of commits', async () => {
      expect.assertions(2);

      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockCommits);

      const result = await octokitService.getRepoCommits(mockToken, { owner, repo }, {});

      expect(result).toStrictEqual(expect.arrayContaining(mockCommits));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockCommits));
    });

    it('should throw RequestError', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('Bad credentials', 401, {
          request: {
            method: 'GET',
            url: 'test',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getRepoCommits(mockToken, { owner, repo }, {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });

    it('should throw NotFound exception', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('NotFound', 404, {
          request: {
            method: 'GET',
            url: '1',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getRepoCommits(mockToken, { owner, repo }, {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });
  });

  describe('getRepoBranches', () => {
    it('should return a list of branches', async () => {
      expect.assertions(2);

      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockBranches);

      const result = await octokitService.getRepoBranches(mockToken, { owner, repo }, {});

      expect(result).toStrictEqual(expect.arrayContaining(mockBranches));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockBranches));
    });

    it('should throw RequestError', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('Bad credentials', 401, {
          request: {
            method: 'GET',
            url: 'test',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getRepoBranches(mockToken, { owner, repo }, {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });

    it('should throw NotFound exception', async () => {
      expect.hasAssertions();

      jest.spyOn(octokit, 'paginate').mockRejectedValue(
        new RequestError('NotFound', 404, {
          request: {
            method: 'GET',
            url: '1',
            headers: {},
          },
        })
      );

      const invokeFn = () => octokitService.getRepoBranches(mockToken, { owner, repo }, {});

      await expect(invokeFn).rejects.toThrow(RequestError);
    });
  });

  describe('paginationMapFn', () => {
    const response: OctokitResponse<PaginationResults<string>, 200> = {
      headers: {},
      status: 200,
      url: '',
      data: ['t', 'e', 's', 't'],
    };

    it('no pagination', () => {
      expect.assertions(2);

      const invokeFn = paginationMapFn<string>({});

      const result = invokeFn(response, () => {});

      expect(result).toStrictEqual(expect.arrayContaining(response.data));
      expect(result).toHaveLength(response.data.length);
    });

    it('with skip defined and limit undefined', () => {
      expect.assertions(2);

      const invokeFn = paginationMapFn<string>({ skip: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toStrictEqual(expect.arrayContaining(response.data.slice(1)));
      expect(result).toHaveLength(response.data.slice(1).length);
    });

    it('with skip undefined and limit defined', () => {
      expect.assertions(2);

      const invokeFn = paginationMapFn<string>({ limit: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toStrictEqual(expect.arrayContaining(response.data.slice(0, 1)));
      expect(result).toHaveLength(response.data.slice(0, 1).length);
    });

    it('with both skip and limit defined', () => {
      expect.assertions(2);

      const invokeFn = paginationMapFn<string>({ skip: 1, limit: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toStrictEqual(expect.arrayContaining(response.data.slice(1, 2)));
      expect(result).toHaveLength(response.data.slice(1, 2).length);
    });
  });
});
