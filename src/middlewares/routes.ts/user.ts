import { getTokenFromRequest } from "../../errors/auth";
import { OctokitService } from "../../services/octokit.service";
import { ExpressRouteFn } from "../type";

export default function getUserRoute(octokitService: OctokitService): ExpressRouteFn {
  return async (req, res, next) => {
    try {
      const token = getTokenFromRequest(req);

      const user = await octokitService.getUserFromAccessToken(token);

      res.status(200).json(user);
    } catch (error) {
      next!(error);
    }
  };
}