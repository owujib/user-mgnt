import { PersmissionAttributes } from 'interface/models';
import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema<PersmissionAttributes>(
  {
    description: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<PersmissionAttributes>(
  'Permission',
  PermissionSchema,
);
