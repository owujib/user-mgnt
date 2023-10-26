import { UserAttributes } from 'interface/models';

declare global {
  namespace Express {
    interface Request {
      user: UserAttributes;
    }
  }
}
