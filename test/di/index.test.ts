/* eslint-disable jest/max-expects */

import 'reflect-metadata';
import { di, container } from '../../src/di';
import { types } from '../../src/di/types';
import { OctokitService } from '../../src/services/octokit.service';

describe('dI test', () => {
  it('should handle instantiating', () => {
    expect.assertions(8);

    expect(di).toBeDefined();
    expect(container.isBound(types.OctokitToken)).toBeTruthy();
    expect(container.isBound(types.RepoController)).toBeTruthy();
    expect(container.isBound(types.AuthController)).toBeTruthy();
    expect(container.isBound(types.UserController)).toBeTruthy();
    expect(container.isBound(types.ErrorHandlingMiddleware)).toBeTruthy();
    expect(container.isBound(OctokitService)).toBeTruthy();
    expect(di.isContainerCreated).toBeTruthy();
  });
});
