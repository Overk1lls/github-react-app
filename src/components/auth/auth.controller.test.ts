import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { OctokitService } from '../octokit/octokit.service';
import { mockCode, mockTokenResponse } from '../../../test/__mock__';
import { githubConfig } from '../../lib/config';

describe('authController', () => {
  let authController: AuthController;
  let octokitService: OctokitService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [githubConfig],
        }),
      ],
      controllers: [AuthController],
      providers: [OctokitService],
    }).compile();

    octokitService = moduleRef.get<OctokitService>(OctokitService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('auth', () => {
    it('should return an access token', async () => {
      expect.hasAssertions();

      jest.spyOn(octokitService, 'getTokenByCode').mockResolvedValue(mockTokenResponse);

      const result = await authController.auth(mockCode);

      expect(result).toStrictEqual(
        expect.objectContaining({
          accessToken: mockTokenResponse.access_token,
        })
      );
    });
  });
});
