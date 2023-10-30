import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor() {}
  Bucket = process.env.AWS_POST_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_PK,
    secretAccessKey: process.env.AWS_S3_SK,
  });

  async UploadFile(file: any) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(file, this.Bucket, originalname, file.mimetype);
  }

  async s3_upload(file, bucket, name, mimetype) {
    let data = file.buffer;

    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: data,
      ContentType: mimetype,
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async removeFile(key: any) {
    try {
      const params = {
        Bucket: this.Bucket,
        Key: key,
      };

      const response = await this.s3.deleteObject(params).promise();
      return { message: `Object '${key}' deleted successfully` };
    } catch (err) {
      return err;
    }
  }
}
