import { Request } from "express";
import { Paginate } from "../services/octokit.service";

export function getPaginateParamsFromQuery(req: Request): Paginate {
  const { skip, limit } = req.query;
  return {
    skip: skip ? parseInt(skip.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  };
}