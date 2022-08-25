import { NextFunction, Request, Response } from "express";

export type ExpressRouteFn = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;