import 'reflect-metadata';
import { createRequest } from 'node-mocks-http';
import { OctokitService } from '../../src/services/octokit.service';
import { UserController } from '../../src/controllers/user.controller';
import { mockUser } from '../__mock__/index';
import { LogicError } from '../../src/errors/logic.error';

describe('UserController', () => {
  const octokitService = new OctokitService();
  const userController = new UserController(octokitService);

  describe('getUser', () => {
    const spyOnUserByTokenFn = jest
      .spyOn(octokitService, 'getUserByToken')
      .mockResolvedValue(mockUser);

    test('proper token - 200 with a token', async () => {
      const token = 'token';
      const req = createRequest({
        headers: {
          authorization: 'Bearer ' + token,
        },
      });

      const { json } = await userController.getUser(req);

      expect(json).toEqual(mockUser);
      expect(spyOnUserByTokenFn).toHaveBeenLastCalledWith(token);
    });

    test('bad token - LogicError', async () => {
      const req = createRequest();

      const invokeFn = () => userController.getUser(req);

      await expect(invokeFn()).rejects.toThrowError(LogicError);
    });

    test('bad token scheme - LogicError', async () => {
      const req = createRequest({
        headers: {
          authorization: 'not-bearer token',
        },
      });

      const invokeFn = () => userController.getUser(req);

      await expect(invokeFn()).rejects.toThrowError(LogicError);
    });
  });
});
