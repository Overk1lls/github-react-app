import 'reflect-metadata';
import { createRequest } from 'node-mocks-http';
import { OctokitService } from '../../src/services/octokit.service';
import { UserController } from '../../src/controllers/user.controller';
import { mockUser } from '../__mock__/index';
import { LogicError } from '../../src/errors/logic.error';

let octokitService: OctokitService;
let userController: UserController;

describe('userController', () => {
  beforeEach(() => {
    octokitService = new OctokitService();
    userController = new UserController(octokitService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUser', () => {
    it('proper token - 200 with a token', async () => {
      expect.assertions(2);

      jest.spyOn(octokitService, 'getUserByToken').mockResolvedValue(mockUser);

      const token = 'token';
      const req = createRequest({
        headers: {
          authorization: 'Bearer ' + token,
        },
      });

      const { json } = await userController.getUser(req);

      expect(json).toStrictEqual(mockUser);
      expect(octokitService.getUserByToken).toHaveBeenCalledWith(token);
    });

    it('bad token - LogicError', async () => {
      expect.hasAssertions();

      const req = createRequest();

      const invokeFn = () => userController.getUser(req);

      await expect(invokeFn()).rejects.toThrow(LogicError);
    });

    it('bad token scheme - LogicError', async () => {
      expect.hasAssertions();

      const req = createRequest({
        headers: {
          authorization: 'not-bearer token',
        },
      });

      const invokeFn = () => userController.getUser(req);

      await expect(invokeFn()).rejects.toThrow(LogicError);
    });
  });
});
