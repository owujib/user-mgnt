import { RolesAttributes } from 'interface/models';
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema<RolesAttributes>(
  {
    name: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<RolesAttributes>('Role', RoleSchema);
