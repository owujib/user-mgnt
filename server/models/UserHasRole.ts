import { UserHasRoleAttributes } from 'interface/models';
import mongoose from 'mongoose';
import RoleModel from './Role';
import UserModel from './User';

const RoleSchema = new mongoose.Schema<UserHasRoleAttributes>(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RoleModel,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<UserHasRoleAttributes>('UserHasRole', RoleSchema);
