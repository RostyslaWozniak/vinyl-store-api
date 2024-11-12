import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  private bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');
  region = this.configService.getOrThrow('AWS_REGION');

  async upload({ fileName, file }: { fileName: string; file: Buffer }) {
    const keyName = uuid() + fileName.replaceAll(' ', '+');
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: keyName,
        Body: file,
      }),
    );
    const resultUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${keyName}`;
    return resultUrl;
  }

  async delete({ fileUrl }: { fileUrl: string }) {
    const result = await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileUrl.split('/').pop(),
      }),
    );
    return result;
  }
}
