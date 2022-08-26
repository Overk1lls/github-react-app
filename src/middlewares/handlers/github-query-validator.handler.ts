import { Handler } from "express";
import { ErrorCode } from "../../errors/codes";
import { LogicError } from "../../errors/logic.error";

export const githubQueryValidator: Handler = (req, res, next) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) {
    throw new LogicError(
      ErrorCode.QueryBad,
      'Owner and repository are not found in the query'
    );
  }
  next();
};