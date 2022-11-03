import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { apiPrefix } from '../../src/main';
import { AccessTokenResponse } from '../../src/common/models';
import { mockCode, mockTokenResponse } from '../__mock__';
import { OctokitService } from '../../src/components/octokit/octokit.service';

describe('authController e2e', () => {
  let app: INestApplication;
  const octokitService = {
    getTokenByCode: (): AccessTokenResponse => mockTokenResponse,
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

  it('should handle POST /auth', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth')
      .send({ code: mockCode })
      .expect(201)
      .expect({ accessToken: octokitService.getTokenByCode().access_token });
  });
});
