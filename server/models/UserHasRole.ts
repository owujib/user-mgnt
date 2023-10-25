import { UserHasRoleAttributes } from 'interface/models';
import mongoose from 'mongoose';
import RoleModel from './Role';
import PermissionModel from './Permission';

const RoleSchema = new mongoose.Schema<UserHasRoleAttributes>(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RoleModel,
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PermissionModel,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<UserHasRoleAttributes>('UserHasRole', RoleSchema);
