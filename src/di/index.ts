import { OctokitService } from "../services/octokit.service";

export interface Dependencies {
  octokitService: OctokitService;
}

export function createDependencies(): Dependencies {
  const octokitService = new OctokitService();

  return {
    octokitService,
  };
}