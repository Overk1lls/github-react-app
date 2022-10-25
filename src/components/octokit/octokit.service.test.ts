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

describe('OctokitService', () => {
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
    test('should return an access token', async () => {
      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockTokenResponse,
      } as OctokitResponse<AccessTokenResponse, 200>);

      const result = await octokitService.getTokenByCode(mockCode);

      expect(result).toEqual(expect.objectContaining(mockTokenResponse));
      expect(octokit.request).toHaveBeenCalled();
    });

    test('should throw ForbiddenException', async () => {
      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockErrorResponse,
      } as OctokitResponse<typeof mockErrorResponse, any>);

      const invokeFn = () => octokitService.getTokenByCode(mockCode);

      expect(invokeFn).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('getUserByToken', () => {
    test('should return a user', async () => {
      jest.spyOn(octokit, 'request').mockResolvedValue({
        data: mockUser,
      } as OctokitResponse<typeof mockUser, 200>);

      const result = await octokitService.getUserByToken(mockToken);

      expect(result).toEqual(expect.objectContaining(mockUser));
      expect(octokit.request).toHaveBeenCalledWith('GET /user', {
        headers: {
          authorization: `token ${mockToken}`,
        },
      });
    });
  });

  describe('getReposByOrg', () => {
    test('should return a list of repos', async () => {
      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockRepos);

      const result = await octokitService.getReposByOrg(mockToken, 'org', {});

      expect(result).toEqual(expect.arrayContaining(mockRepos));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockRepos));
    });

    test('should throw RequestError', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });

    test('should throw NotFound exception', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });
  });

  describe('getRepoCommits', () => {
    test('should return a list of commits', async () => {
      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockCommits);

      const result = await octokitService.getRepoCommits(mockToken, { owner, repo }, {});

      expect(result).toEqual(expect.arrayContaining(mockCommits));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockCommits));
    });

    test('should throw RequestError', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });

    test('should throw NotFound exception', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });
  });

  describe('getRepoBranches', () => {
    test('should return a list of branches', async () => {
      jest.spyOn(octokit, 'paginate').mockResolvedValue(mockBranches);

      const result = await octokitService.getRepoBranches(mockToken, { owner, repo }, {});

      expect(result).toEqual(expect.arrayContaining(mockBranches));
      expect(octokit.paginate).toHaveReturnedWith(Promise.resolve(mockBranches));
    });

    test('should throw RequestError', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });

    test('should throw NotFound exception', async () => {
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

      expect(invokeFn).rejects.toThrowError(RequestError);
    });
  });

  describe('paginationMapFn', () => {
    const response: OctokitResponse<PaginationResults<string>, 200> = {
      headers: {},
      status: 200,
      url: '',
      data: ['t', 'e', 's', 't'],
    };

    test('no pagination', () => {
      const invokeFn = paginationMapFn<string>({});

      const result = invokeFn(response, () => {});

      expect(result).toEqual(expect.arrayContaining(response.data));
      expect(result.length).toBe(response.data.length);
    });

    test('with skip defined and limit undefined', () => {
      const invokeFn = paginationMapFn<string>({ skip: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toEqual(expect.arrayContaining(response.data.slice(1)));
      expect(result.length).toBe(response.data.slice(1).length);
    });

    test('with skip undefined and limit defined', () => {
      const invokeFn = paginationMapFn<string>({ limit: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toEqual(expect.arrayContaining(response.data.slice(0, 1)));
      expect(result.length).toBe(response.data.slice(0, 1).length);
    });

    test('with both skip and limit defined', () => {
      const invokeFn = paginationMapFn<string>({ skip: 1, limit: 1 });

      const result = invokeFn(response, () => {});

      expect(result).toEqual(expect.arrayContaining(response.data.slice(1, 2)));
      expect(result.length).toBe(response.data.slice(1, 2).length);
    });
  });
});
