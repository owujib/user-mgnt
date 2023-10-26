import { Types, Document, HydratedDocument } from 'mongoose';

export interface UserAttributes {
  _id?: Types.ObjectId;
  username?: string;
  email?: string;
  password: string;
  last_login: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolesAttributes {
  _id?: Types.ObjectId;
  name: string;
}

export interface PersmissionAttributes {
  _id?: Types.ObjectId;
  description: string;
}

export interface UserHasRoleAttributes {
  _id?: Types.ObjectId;
  role_id: HydratedDocument<RolesAttributes>['_id'];
  user_id: HydratedDocument<UserAttributes>['_id'];
}

export interface JwtAssesTokenResource {
  _id?: Types.ObjectId;
  token: string;
  user_id: HydratedDocument<UserAttributes>['_id'];
  revoked: boolean;
  expires_at: Date;
  expires_at_ms: number;
}

export interface PasswordResetsAttributes {
  _id?: Types.ObjectId;
  user_id: HydratedDocument<UserAttributes>['_id'];
  reset_token: string;
  reset_token_expires_at: Date;
  reset_token_expires_at_ms: number;
}
