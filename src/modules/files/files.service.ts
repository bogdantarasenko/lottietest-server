import * as AWS from 'aws-sdk';
import { resolve } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageAdapter } from '@flystorage/local-fs';
import { FileStorage, Visibility } from '@flystorage/file-storage';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesService {
  private storageType: string;
  private storage?: FileStorage;
  private s3?: AWS.S3;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.storageType = this.configService.get('file').driver;

    if (this.storageType === 'local') {
      const uploadPath = resolve(process.cwd(), 'uploads');
      this.storage = new FileStorage(new LocalStorageAdapter(uploadPath));
    } else if (this.storageType === 's3') {
      AWS.config.update({
        region: this.configService.get('file').awsS3Region,
        accessKeyId: this.configService.get('file').accessKeyId,
        secretAccessKey: this.configService.get('file').secretAccessKey,
      });
      this.s3 = new AWS.S3();
    } else {
      throw new Error('Invalid storage type configured');
    }
  }

  async saveFile(file: any): Promise<string> {
    const { createReadStream, filename } = await file;
    const fileExtension = filename.split('.').pop();
    const newFileName = `${uuidv4()}.${fileExtension}`;

    if (this.storageType === 'local') {
      const stream = createReadStream();
      await this.storage!.write(newFileName, stream, {
        visibility: Visibility.PUBLIC,
      });
    } else if (this.storageType === 's3') {
      const stream = createReadStream();
      const bucketName = this.configService.get('file').awsDefaultS3Bucket;
      await this.s3!.upload({
        Body: stream,
        Bucket: bucketName,
        ACL: 'public-read',
        Key: `uploads/${newFileName}`,
      }).promise();
    } else {
      throw new Error('Invalid storage type configured');
    }

    return newFileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    if (this.storageType === 'local') {
      await this.storage!.deleteFile(fileName);
    } else if (this.storageType === 's3') {
      await this.s3!.deleteObject({
        Key: `uploads/${fileName}`,
        Bucket: this.configService.get('file').awsDefaultS3Bucket,
      }).promise();
    } else {
      throw new Error('Invalid storage type configured');
    }
  }

  async getS3File(fileName: string): Promise<Readable> {
    const key = `uploads/${fileName}`;
    const bucket = await this.configService.get('file').awsDefaultS3Bucket;

    return this.s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
  }

  async getLocalFile(fileName: string): Promise<string> {
    const directory = 'uploads';
    return resolve(process.cwd(), directory, fileName);
  }
}
