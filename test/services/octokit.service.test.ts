import 'reflect-metadata';
import {
  AccessTokenResponse,
  OctokitService,
  paginateMapFn,
} from '../../src/services/octokit.service';
import { LogicError } from '../../src/errors/logic.error';
import { accessTokenResponse, mockOrgName, mockRepoName, mockData, mockUser } from '../__mock__';
import type { OctokitResponse } from '@octokit/types';
import type { PaginationResults } from '@octokit/plugin-paginate-rest/dist-types/types';

let octokitService: OctokitService;

describe('octokitService', () => {
  beforeEach(() => {
    octokitService = new OctokitService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getReposByOrg', () => {
    it('with a proper org name', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService.getOctokit, 'paginate').mockResolvedValue(mockData);

      const result = await octokitService.getReposByOrg(mockOrgName);

      expect(result).toStrictEqual(mockData);
      expect(octokitService.getOctokit.paginate).toHaveReturnedWith(Promise.resolve(mockData));
    });
  });

  describe('getRepoCommits', () => {
    it('with a proper owner & repo args', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService.getOctokit, 'paginate').mockResolvedValue(mockData);

      const result = await octokitService.getRepoCommits(mockOrgName, mockRepoName);

      expect(result).toStrictEqual(mockData);
      expect(octokitService.getOctokit.paginate).toHaveReturnedWith(Promise.resolve(mockData));
    });
  });

  describe('getRepoBranches', () => {
    it('with a proper owner & repo args', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService.getOctokit, 'paginate').mockResolvedValue(mockData);

      const result = await octokitService.getRepoBranches(mockOrgName, mockRepoName);

      expect(result).toStrictEqual(mockData);
      expect(octokitService.getOctokit.paginate).toHaveReturnedWith(Promise.resolve(mockData));
    });
  });

  describe('getRepoData', () => {
    const mockResponse: OctokitResponse<PaginationResults<string>, 200> = {
      headers: {},
      status: 200,
      url: '',
      data: ['w', 'o', 'r', 'k', 's'],
    };
    const mockDoneFn = () => null;

    it('with all the data', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService.getOctokit, 'paginate').mockResolvedValue(mockData);

      const result = await octokitService.getRepoData('GET /app/hook/deliveries', {
        org: mockOrgName,
        repo: mockRepoName,
        owner: mockRepoName,
        skip: 1,
        limit: 1,
      });

      expect(result).toStrictEqual(mockData);
      expect(octokitService.getOctokit.paginate).toHaveReturnedWith(Promise.resolve(mockData));
    });

    it('with skip & limit undefined', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService.getOctokit, 'paginate').mockResolvedValue(mockData);

      const result = await octokitService.getRepoData('GET /app/hook/deliveries', {
        org: mockOrgName,
        repo: mockRepoName,
        owner: mockRepoName,
      });

      expect(result).toStrictEqual(mockData);
      expect(octokitService.getOctokit.paginate).toHaveReturnedWith(Promise.resolve(mockData));
    });

    it('map function with limit', () => {
      expect.hasAssertions();

      const mockLimit = 1;
      const mockMapFn = paginateMapFn<typeof mockResponse>(mockLimit);

      const result = mockMapFn(mockResponse, mockDoneFn);

      expect(result).toStrictEqual(expect.arrayContaining([mockResponse.data[mockLimit - 1]]));
    });

    it('map function without limit', () => {
      expect.hasAssertions();

      const mockMapFn = paginateMapFn<typeof mockResponse>(undefined);

      const result = mockMapFn(mockResponse, mockDoneFn);

      expect(result).toStrictEqual(expect.arrayContaining(mockResponse.data));
    });
  });

  describe('getTokenByCode', () => {
    it('with a 200 response', async () => {
      expect.assertions(2);

      const mockOctokitResponse: OctokitResponse<AccessTokenResponse, 200> = {
        headers: {},
        status: 200,
        url: '',
        data: accessTokenResponse,
      };
      jest.spyOn(octokitService.getOctokit, 'request').mockResolvedValue(mockOctokitResponse);

      const result = await octokitService.getTokenByCode('test');

      expect(result).toStrictEqual(mockOctokitResponse.data);
      expect(octokitService.getOctokit.request).toHaveReturnedWith(
        Promise.resolve(mockOctokitResponse)
      );
    });

    it('with an error', async () => {
      expect.assertions(2);

      const mockOctokitResponse: OctokitResponse<
        {
          error: string;
          error_description: string;
        },
        400
      > = {
        headers: {},
        status: 400,
        url: '',
        data: {
          error: 'error',
          error_description: 'something went wrong',
        },
      };
      jest.spyOn(octokitService.getOctokit, 'request').mockResolvedValue(mockOctokitResponse);

      const invokeFn = () => octokitService.getTokenByCode('test');

      await expect(invokeFn).rejects.toThrow(LogicError);
      expect(octokitService.getOctokit.request).toHaveReturnedWith(
        Promise.resolve(mockOctokitResponse.data)
      );
    });
  });

  describe('getUserByToken', () => {
    it('expect a user', async () => {
      expect.assertions(2);

      const mockOctokitResponse: OctokitResponse<typeof mockUser, 200> = {
        headers: {},
        status: 200,
        url: '',
        data: mockUser,
      };
      const mockOctokitRequest = jest
        .spyOn(octokitService.getOctokit, 'request')
        .mockResolvedValue(mockOctokitResponse);

      const result = await octokitService.getUserByToken('test');

      expect(result).toStrictEqual(mockOctokitResponse.data);
      expect(mockOctokitRequest).toHaveBeenCalledWith<[string, Record<string, any>]>('GET /user', {
        headers: {
          Authorization: 'token test',
        },
      });
    });
  });
});
