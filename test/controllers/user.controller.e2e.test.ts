import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { apiPrefix } from '../../src/main';
import { mockToken, mockUser } from '../__mock__';
import { OctokitService } from '../../src/components/octokit/octokit.service';

describe('userController e2e', () => {
  let app: INestApplication;
  const octokitService = {
    getUserByToken: () => mockUser,
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

  describe('getUser', () => {
    it('should handle GET /user', () => {
      return request(app.getHttpServer())
        .get('/api/v1/user')
        .auth(mockToken, { type: 'bearer' })
        .expect(200)
        .expect(mockUser);
    });

    it('should handle GET /user without bearer token', () => {
      return request(app.getHttpServer()).get('/api/v1/user').expect(401);
    });
  });
});
