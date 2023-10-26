> this template was forked from [my respository](https://github.com/owujib/express-squelize-boilerplate)


---

# User Management Service

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Postman Collection](#postman-collection)



## Features

- User Account Creation
- List User(Admin Role)
- Update Password
- Reset Password
- Forgot Password
- Update User Profile
- User Login

## Tech Stack
- Node.js (LTS version)
- TypeScript
- Mongoose.js ORM
- MongoDb
- Express.js (for routing)


## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:owujib/user-mgnt.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user-mgnt
   ```

3. Install dependencies:

   ```bash
   npm install
   ```


### Configuration

1. Create a `.env` file in the project root and configure the following environment variables:

   ```env
    NODE_ENV=development

    APP_KEY=32a7c526b05e8001d9f475725128a25ca616509d

    DB_PROD_URL=

    DB_URL=mongodb://localhost:27017/userMgnt

    UPLOADS_DIR=uploads

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=


    AWS_ACCESS_KEY_ID=''
    AWS_SECRET_ACCESS_KEY=''
    AWS_DEFAULT_REGION=''
    AWS_BUCKET=''
    AWS_URL=''
    AWS_ENDPOINT=''
    AWS_USE_PATH_STYLE_ENDPOINT=''
    JWT_EXPIRES_IN=7d

    #smtp configuration
    EMAIL_HOST=
    EMAIL_PORT=587
    EMAIL_USERNAME=
    EMAIL_PASSWORD=
   ```

   Replace `test database configuration`, with your actual database configurations.

## API Endpoints


Postman Endpoint [Postman Link](https://www.postman.com/owujib/workspace/public-workspace/collection/27213384-f01bc6d9-9472-4790-b673-af1b12a69b37?action=share&creator=27213384)
