import 'reflect-metadata';
import { OctokitService } from '../../src/services/octokit.service';
import { AuthController } from '../../src/controllers/auth.controller';
import { accessTokenResponse } from '../__mock__';
import { LogicError } from '../../src/errors/logic.error';

let octokitService: OctokitService;
let authController: AuthController;

describe('authController', () => {
  beforeEach(() => {
    octokitService = new OctokitService();
    authController = new AuthController(octokitService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const code = 'test';

  describe('auth', () => {
    it('200 response', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService, 'getTokenByCode').mockResolvedValue(accessTokenResponse);

      const { json } = await authController.auth({ code });

      expect(json).toStrictEqual(expect.objectContaining({ accessToken: accessTokenResponse }));
      expect(octokitService.getTokenByCode).toHaveBeenCalledWith(code);
    });

    it('400 response', async () => {
      expect.hasAssertions();

      const invokeFn = () => authController.auth({});

      await expect(invokeFn).rejects.toThrow(LogicError);
    });
  });
});
