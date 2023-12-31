import mongoose from 'mongoose';

require('dotenv').config();
const path = require('path');

export default () => {
  return mongoose.connect(
    process.env.NODE_ENV === 'production'
      ? <string>process.env.DB_PROD_URL
      : <string>process.env.DB_URL,
  );
};
