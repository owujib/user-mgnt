import { UserAttributes } from 'interface/models';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    username: {
      type: String,
      required: [true, 'username is a required field'],
      unique: true,
    },

    email: {
      type: String,
      required: [true, 'emails is a required field'],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'password is a required field'],
      min: 5,
      max: 15,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<UserAttributes>('User', UserSchema);
