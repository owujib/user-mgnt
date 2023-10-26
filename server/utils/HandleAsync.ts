import { Request, Response, NextFunction } from 'express';

const HandleAsync =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default HandleAsync;
