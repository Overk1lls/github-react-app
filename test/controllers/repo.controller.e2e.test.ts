import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { apiPrefix } from '../../src/main';
import { mockBranches, mockCommits, mockRepos, mockToken } from '../__mock__';
import { OctokitService } from '../../src/components/octokit/octokit.service';

describe('repoController e2e', () => {
  let app: INestApplication;
  const octokitService = {
    getReposByOrg: () => mockRepos,
    getRepoBranches: () => mockBranches,
    getRepoCommits: () => mockCommits,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OctokitService)
      .useValue(octokitService)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix(apiPrefix);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getReposByOrg', () => {
    it('should handle GET /repos/by-org/1', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repos/by-org/1')
        .auth(mockToken, { type: 'bearer' })
        .expect(200)
        .expect(mockRepos);
    });

    it('should handle GET /repos/by-org/1 without bearer token', () => {
      return request(app.getHttpServer()).get('/api/v1/repos/by-org/1').expect(401);
    });
  });

  describe('getRepoBranches', () => {
    it('should handle GET /repos/by-owner/1/1/branches', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repos/by-owner/1/1/branches')
        .auth(mockToken, { type: 'bearer' })
        .expect(200)
        .expect(mockBranches);
    });

    it('should handle GET /repos/by-owner/1/1/branches without bearer token', () => {
      return request(app.getHttpServer()).get('/api/v1/repos/by-owner/1/1/branches').expect(401);
    });
  });

  describe('getRepoCommits', () => {
    it('should handle GET /repos/by-owner/1/1/commits', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repos/by-owner/1/1/commits')
        .auth(mockToken, { type: 'bearer' })
        .expect(200)
        .expect(mockCommits);
    });

    it('should handle GET /repos/by-owner/1/1/commits without bearer token', () => {
      return request(app.getHttpServer()).get('/api/v1/repos/by-owner/1/1/commits').expect(401);
    });
  });
});
