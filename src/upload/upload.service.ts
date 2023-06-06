import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { s3Config } from 'src/core/configs/s3.config';

@Injectable()
export class UploadService {
  private s3: S3;

  constructor() {
    this.s3 = new S3(s3Config);
  }

  async uploadImage(file: Express.Multer.File) {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await this.s3.upload(params).promise();

    return {
      image: uploadResult.Key,
      location: uploadResult.Location,
    };
  }
}
