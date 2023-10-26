import { PasswordResetsAttributes } from '../interface/models';

import mongoose from 'mongoose';
import UserModel from './User';

const PasswordResetSchema = new mongoose.Schema<PasswordResetsAttributes>(
  {
    reset_token: {
      type: String,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel,
    },

    reset_token_expires_at: {
      type: Date,
    },
    reset_token_expires_at_ms: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<PasswordResetsAttributes>(
  'PasswordReset',
  PasswordResetSchema,
);
