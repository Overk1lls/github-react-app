import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { OctokitService } from '../../src/components/octokit/octokit.service';
import { UserController } from '../../src/components/user/user.controller';
import { mockToken, mockUser } from '../__mock__';

describe('UserController', () => {
  let octokitService: OctokitService;
  let userController: UserController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [OctokitService],
    }).compile();

    octokitService = moduleRef.get<OctokitService>(OctokitService);
    userController = moduleRef.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    test('should return a user', async () => {
      const req = {
        headers: {
          authorization: 'Bearer ' + mockToken,
        },
      } as Request;
      jest.spyOn(octokitService, 'getUserByToken').mockResolvedValue(mockUser);

      const result = await userController.getUser(req);

      expect(result).toEqual(mockUser);
      expect(octokitService.getUserByToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
