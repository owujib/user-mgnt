// CloudinaryStorageProvider.js

import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import FileConfig from '../../config/fileConfig';
import { resourceTypes } from '../../types';

class CloudinaryStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: FileConfig.disks.cloudinary.cloud_name,
      api_key: FileConfig.disks.cloudinary.api_key,
      api_secret: FileConfig.disks.cloudinary.api_secret,
      secure: FileConfig.disks.cloudinary.secure,
    });
  }

  async removeFile(
    publicId: string,
    resourceType: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resource_type: resourceTypes,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.upload(file.path, { resource_type, folder });
  }
}

export default CloudinaryStorageProvider;
