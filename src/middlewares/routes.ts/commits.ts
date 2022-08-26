import { getPaginateParamsFromQuery } from "../../lib/utils";
import { OctokitService } from "../../services/octokit.service";
import { ExpressRouteFn } from "../type";

export default function getCommitsRoute(octokitService: OctokitService): ExpressRouteFn {
  return async (req, res, next) => {
    try {
      const { owner, repo } = req.params;

      const commits = await octokitService.getRepositoryCommits(
        owner,
        repo,
        getPaginateParamsFromQuery(req)
      );

      res.status(200).json({ commits });
    } catch (error) {
      next!(error);
    }
  };
}
