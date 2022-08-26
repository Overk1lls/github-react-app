import { OctokitService } from "../../services/octokit.service";
import { ExpressRouteFn } from "../type";

export default function authorizeRoute(octokitService: OctokitService): ExpressRouteFn {
  return async (req, res, next) => {
    try {
      const { code }: { code: string } = req.body;

      const accessToken = await octokitService.getAccessTokenByCode(code);

      res.status(200).json({ accessToken });
    } catch (error) {
      next!(error);
    }
  };
};
