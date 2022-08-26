import { getPaginateParamsFromQuery } from "../../lib/utils";
import { OctokitService } from "../../services/octokit.service";
import { ExpressRouteFn } from "../type";

export default function getRepositoriesRoute(octokitService: OctokitService): ExpressRouteFn {
  return async (req, res, next) => {
    try {
      const { org } = req.params;

      const repos = await octokitService.getRepositoriesByOrg(
        org,
        getPaginateParamsFromQuery(req)
      );

      res.status(200).json({ repositories: repos });
    } catch (error) {
      next!(error);
    }
  };
}