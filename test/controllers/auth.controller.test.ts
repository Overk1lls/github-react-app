import 'reflect-metadata';
import { OctokitService } from '../../src/services/octokit.service';
import { AuthController } from '../../src/controllers/auth.controller';
import { createRequest } from 'node-mocks-http';
import { accessTokenResponse } from '../__mock__';
import { LogicError } from '../../src/errors/logic.error';

describe('AuthController', () => {
  const octokitService = new OctokitService();
  const authController = new AuthController(octokitService);

  const code = 'test';

  describe('auth', () => {
    it('200 response', async () => {
      const req = createRequest({
        body: {
          code,
        },
      });

      const spyOnTokenFn = jest
        .spyOn(octokitService, 'getTokenByCode')
        .mockResolvedValue(accessTokenResponse);

      const { json } = await authController.auth(req);

      expect(json).toEqual(expect.objectContaining({ accessToken: accessTokenResponse }));
      expect(spyOnTokenFn).toHaveBeenLastCalledWith(code);
    });

    it('400 response', async () => {
      const req = createRequest();

      const invokeFn = () => authController.auth(req);

      await expect(invokeFn).rejects.toThrowError(LogicError);
    });

    it('200 response', async () => {
      const req = createRequest({
        body: {
          code,
        },
      });
      const spyOnTokenFn = jest.spyOn(octokitService, 'getTokenByCode').mockResolvedValue('error');

      const invokeFn = () => authController.auth(req);

      await expect(invokeFn).rejects.toThrowError(LogicError);
      expect(spyOnTokenFn).toHaveBeenLastCalledWith(req.body.code);
    });
  });
});
