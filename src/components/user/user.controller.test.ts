import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Request } from 'express';
import { OctokitService } from '../octokit/octokit.service';
import { UserController } from './user.controller';
import { mockToken, mockUser } from '../../../test/__mock__';
import { githubConfig } from '../../lib/config';

describe('userController', () => {
  let octokitService: OctokitService;
  let userController: UserController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [githubConfig],
        }),
      ],
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
    it('should return a user', async () => {
      expect.assertions(2);

      const req = {
        headers: {
          authorization: 'Bearer ' + mockToken,
        },
      } as Request;
      jest.spyOn(octokitService, 'getUserByToken').mockResolvedValue(mockUser);

      const result = await userController.getUser(req);

      expect(result).toStrictEqual(mockUser);
      expect(octokitService.getUserByToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
