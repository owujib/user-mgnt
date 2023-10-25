import { Types, Document, HydratedDocument } from 'mongoose';

export interface UserAttributes {
  _id?: Types.ObjectId;
  username?: string;
  email?: string;
  password: string;
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
  permission_id: HydratedDocument<PersmissionAttributes>['_id'];
}
