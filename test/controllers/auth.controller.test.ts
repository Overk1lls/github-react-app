import { Test } from '@nestjs/testing';
import { AuthController } from '../../src/components/auth/auth.controller';
import { OctokitService } from '../../src/components/octokit/octokit.service';
import { mockCode, mockTokenResponse } from '../__mock__';

describe('AuthController', () => {
  let authController: AuthController;
  let octokitService: OctokitService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
    test('should return an access token', async () => {
      jest.spyOn(octokitService, 'getTokenByCode').mockResolvedValue(mockTokenResponse);

      const result = await authController.auth(mockCode);

      expect(result).toEqual(
        expect.objectContaining({
          accessToken: mockTokenResponse.access_token,
        })
      );
    });
  });
});
