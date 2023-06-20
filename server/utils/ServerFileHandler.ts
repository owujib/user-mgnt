import fs from 'fs';

class ServerFileHanlders {
  createDir(path: string): string {
    let pathExists: any = fs.existsSync(path);
    if (!pathExists) {
      pathExists = fs.mkdirSync(path, {
        recursive: true,
      });
      return pathExists;
    } else {
      return pathExists;
    }
  }
  runDirs(path: string) {
    //run for files
    const dir = this.createDir(path);
    if (dir && path.toLocaleLowerCase().match(/controllers/)) {
      fs.writeFileSync(`${path}/index.ts`, this.CONTROLLER_CONTEXT);

      //create an example file for controller
      fs.writeFileSync(
        `${path}/TextController.ts`,
        this.TESTCONTROLLER_CONTEXT,
      );
    } else if (dir && path.toLowerCase().match(/middlewares/)) {
      fs.writeFileSync(`${path}/TestMiddleware.ts`, this.MIDDLEWARE_CONTEXT);
    }
  }

  private CONTROLLER_CONTEXT = `
import { Response } from 'express';
class Controller {
    public sendSuccessResponse(
        res: Response,
        data: any,
        message: string,
        statusCode: number,
    ) {
        return res.status(200|| statusCode).json({
        status: 'success',
        data,
        message,
        });
    }
}
export default Controller;`;

  private MIDDLEWARE_CONTEXT = `
import { Response, Request, NextFunction } from 'express';
class MiddleWare {
    verify(req: Request, res: Response, next:NextFunction){
        return next()
    }
}
export default new MiddleWare();`;
  private TESTCONTROLLER_CONTEXT = `
import { Response, Request, NextFunction } from 'express';
import Controller from "."
    class TestController extends Controller {
        play(req: Request, res: Response, next:NextFunction){
            return super.sendSuccessResponse(res, {}, 'testing a controller', 200)
        }
    }
}
export default new TestController();`;
}

export default ServerFileHanlders;
