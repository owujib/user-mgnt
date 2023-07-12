import { Response, Request, NextFunction } from 'express';
import Controller from '.';

class TestController extends Controller {
  play(req: Request, res: Response, next: NextFunction) {
    return super.sendSuccessResponse(res, {}, 'testing a controller', 200);
  }
}

export default new TestController();
