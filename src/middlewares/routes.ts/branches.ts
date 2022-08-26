import { getPaginateParamsFromQuery } from "../../lib/utils";
import { OctokitService } from "../../services/octokit.service";
import { ExpressRouteFn } from "../type";

export default function getBranchesRoute(octokitService: OctokitService): ExpressRouteFn {
  return async (req, res, next) => {
    try {
      const { owner, repo } = req.params;

      const branches = await octokitService.getRepositoryBranches(
        owner,
        repo,
        getPaginateParamsFromQuery(req)
      );

      res.status(200).json({ branches });
    } catch (error) {
      next!(error);
    }
  };
}
