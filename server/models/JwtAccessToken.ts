import { JwtAssesTokenResource } from '../interface/models';

import mongoose from 'mongoose';

const JwtAccessTokenSchema = new mongoose.Schema<JwtAssesTokenResource>(
  {
    token: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    expires_at: {
      type: Date,
    },
    expires_at_ms: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<JwtAssesTokenResource>(
  'JwtAccessToken',
  JwtAccessTokenSchema,
);
