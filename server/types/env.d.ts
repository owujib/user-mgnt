declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      UPLOADS_DIR: string;
      DB_URL: string;
      DB_PROD_URL: string;

      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_HOST: string;
      DIALECT: string;

      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_DEFAULT_REGION: string;
      AWS_BUCKET: string;
      AWS_URL: string;
      AWS_ENDPOINT: string;
      AWS_USE_PATH_STYLE_ENDPOINT: string;

      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
