import 'reflect-metadata';
import {
  AccessTokenResponse,
  OctokitService,
  paginateMapFn,
} from '../../src/services/octokit.service';
import { accessTokenResponse, mockOrgName, mockRepoName, mockData, mockUser } from '../__mock__';
import type { OctokitResponse } from '@octokit/types';
import type { PaginationResults } from '@octokit/plugin-paginate-rest/dist-types/types';

describe('OctokitService', () => {
  const octokitService = new OctokitService();

  const getRepoDataSpy = jest.spyOn(octokitService, 'getRepoData').mockResolvedValue(mockData);

  describe('getReposByOrg', () => {
    it('with a proper org name', async () => {
      const result = await octokitService.getReposByOrg(mockOrgName);

      expect(result).toEqual(mockData);
      // expect(getRepoDataSpy).toHaveBeenCalled();
    });
  });

  describe('getRepoCommits', () => {
    it('with a proper owner & repo args', async () => {
      const result = await octokitService.getRepoCommits(mockOrgName, mockRepoName);

      expect(result).toEqual(mockData);
      // expect(getRepoDataSpy).toHaveBeenCalled();
    });
  });

  describe('getRepoBranches', () => {
    it('with a proper owner & repo args', async () => {
      const result = await octokitService.getRepoBranches(mockOrgName, mockRepoName);

      expect(result).toEqual(mockData);
      // expect(getRepoDataSpy).toHaveBeenCalled();
    });
  });

  describe('getRepoData', () => {
    getRepoDataSpy.mockClear();
    getRepoDataSpy.mockRestore();

    const mockOctokitPaginate = jest
      .spyOn(octokitService.getOctokit, 'paginate')
      .mockResolvedValue(mockData);

    const mockResponse: OctokitResponse<PaginationResults<string>, 200> = {
      headers: {},
      status: 200,
      url: '',
      data: ['w', 'o', 'r', 'k', 's'],
    };
    const mockDoneFn = () => null;

    it('with all the data', async () => {
      const result = await octokitService.getRepoData('GET /app/hook/deliveries', {
        org: mockOrgName,
        repo: mockRepoName,
        owner: mockRepoName,
        skip: 1,
        limit: 1,
      });

      expect(result).toEqual(mockData);
      expect(mockOctokitPaginate).toHaveBeenCalledTimes(4);
      expect(octokitService.getOctokit.paginate).toHaveBeenCalledTimes(4);
    });

    it('with skip & limit undefined', async () => {
      const result = await octokitService.getRepoData('GET /app/hook/deliveries', {
        org: mockOrgName,
        repo: mockRepoName,
        owner: mockRepoName,
      });

      expect(result).toEqual(mockData);
      expect(mockOctokitPaginate).toHaveBeenCalledTimes(5);
      expect(octokitService.getOctokit.paginate).toHaveBeenCalledTimes(5);
    });

    it('map function with limit', () => {
      const mockLimit = 1;
      const mockMapFn = paginateMapFn<typeof mockResponse>(mockLimit);

      const result = mockMapFn(mockResponse, mockDoneFn);

      expect(result).toEqual(expect.arrayContaining([mockResponse.data[mockLimit - 1]]));
    });

    it('map function without limit', () => {
      const mockMapFn = paginateMapFn<typeof mockResponse>(undefined);

      const result = mockMapFn(mockResponse, mockDoneFn);

      expect(result).toEqual(expect.arrayContaining(mockResponse.data));
    });
  });

  describe('getTokenByCode', () => {
    it('with a 200 response', async () => {
      const mockOctokitResponse: OctokitResponse<AccessTokenResponse, 200> = {
        headers: {},
        status: 200,
        url: '',
        data: accessTokenResponse,
      };
      const mockOctokitRequest = jest
        .spyOn(octokitService.getOctokit, 'request')
        .mockResolvedValue(mockOctokitResponse);

      const result = (await octokitService.getTokenByCode('test')) as AccessTokenResponse;

      expect(result).toEqual(mockOctokitResponse.data);
      expect(mockOctokitRequest).toHaveBeenCalled();
      expect(octokitService.getOctokit.request).toHaveBeenCalled();

      mockOctokitRequest.mockRestore();
    });

    it('with an error', async () => {
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
      const mockOctokitRequest = jest
        .spyOn(octokitService.getOctokit, 'request')
        .mockResolvedValue(mockOctokitResponse);

      const result = (await octokitService.getTokenByCode('test')) as string;

      expect(result).toEqual(mockOctokitResponse.data.error_description);
      expect(mockOctokitRequest).toHaveBeenCalled();
      expect(octokitService.getOctokit.request).toHaveBeenCalled();

      mockOctokitRequest.mockRestore();
    });
  });

  describe('getUserByToken', () => {
    it('expect a user', async () => {
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

      expect(result).toEqual(mockOctokitResponse.data);
      expect(mockOctokitRequest).toHaveBeenCalled();
      expect(octokitService.getOctokit.request).toHaveBeenCalled();

      mockOctokitRequest.mockRestore();
    });
  });
});
