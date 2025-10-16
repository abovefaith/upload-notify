import { Injectable } from '@angular/core';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectCannedACL,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly BUCKET_NAME = 'kenwide';
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'nyc-1',
      endpoint: 'https://objectstore.nyc1.civo.com',
      credentials: {
        accessKeyId: 'DMLRUYZY3H7P0UOAB21P', // Use env vars in production
        secretAccessKey: '9UEAxFEcUGdxPIHghKpCZaCWubNBo7JDzBpA5PNT', // Use env vars
      },
      forcePathStyle: true,
    });
  }

  private normalizeFolder(folderName: string): string {
    return folderName.endsWith('/') ? folderName : folderName + '/';
  }

  async uploadFile(folderName: string, file: File): Promise<string> {
    const key = this.normalizeFolder(folderName) + file.name;

    const params: PutObjectCommandInput = {
      Bucket: this.BUCKET_NAME,
      Key: key,
      Body: file,
      ACL: ObjectCannedACL.public_read,
    };

    await this.s3Client.send(new PutObjectCommand(params));
    console.log(` Uploaded: ${key}`);

    return key;
  }

  async listFiles(folderName: string): Promise<string[]> {
    const prefix = this.normalizeFolder(folderName);

    const command = new ListObjectsV2Command({
      Bucket: this.BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    const fileKeys = response.Contents?.map((obj) => obj.Key!).filter(Boolean) || [];

    console.log(' Files found:', fileKeys);
    return fileKeys;
  }

  async deleteFile(folderName: string, fileName: string): Promise<void> {
    const key = this.normalizeFolder(folderName) + fileName;

    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
    });

    await this.s3Client.send(command);
    console.log(` Deleted file: ${key}`);
  }

  async deleteAllFiles(folderName: string): Promise<void> {
    const fileKeys = await this.listFiles(folderName);
    if (fileKeys.length === 0) {
      console.log('Nothing to delete.');
      return;
    }

    const command = new DeleteObjectsCommand({
      Bucket: this.BUCKET_NAME,
      Delete: {
        Objects: fileKeys.map((key) => ({ Key: key })),
      },
    });

    await this.s3Client.send(command);
    console.log(` All files deleted from ${folderName}/`);
  }
}
