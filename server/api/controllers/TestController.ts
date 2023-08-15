import { Response, Request, NextFunction } from 'express';
import Controller from '.';

import Helper from '../../helpers';
import { uploadFileHandler } from '../../decorators/FileHandler';

class TestController extends Controller {
  constructor() {
    super();
  }

  @uploadFileHandler({
    fields: [{ name: 'image', maxCount: 1 }],
    validationFunction: Helper.requestFileValidation([
      'image/jpeg',
      'image/png',
      'application/pdf',
    ]),
    limit: Helper.convertToBytes(2),
  })
  async play(req: Request, res: Response, next: NextFunction) {
    console.log(req.files);
    return super.sendSuccessResponse(res, {}, 'testing a controller', 200);
  }
}

export default new TestController();
