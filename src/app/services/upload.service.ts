
//      //url will be {BASEURL}/{BUCKETnAME}/{FOLDERNAME}/{FILENAME}.{FILEEXTENSION}
// import { Injectable } from '@angular/core';
// import { S3Client, PutObjectCommand, ObjectCannedACL, PutObjectCommandInput } from '@aws-sdk/client-s3';
// import { Observable, firstValueFrom, from } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class UploadService {
//   private s3Client: S3Client;

//   constructor() {
//     // Configure the S3 client for Civo Object Store
//     this.s3Client = new S3Client({
//       region: 'nyc-1', // Replace with your Civo region if different
//       endpoint: 'https://objectstore.nyc1.civo.com', // Replace with your Civo endpoint
//       credentials: {
//         accessKeyId: 'DMLRUYZY3H7P0UOAB21P', // Replace with your Access Key
//         secretAccessKey: '9UEAxFEcUGdxPIHghKpCZaCWubNBo7JDzBpA5PNT', // Replace with your Secret Key
//       },
//       forcePathStyle: true,
//     });
//   }

//   async uploadFile(file: File) {
//     console.log("file", file);

//     const params: PutObjectCommandInput = {
//       Bucket: 'kenwide', // Replace with your Civo bucket name
//       Key: file.name,
//       Body: file,
//       ACL:  ObjectCannedACL.public_read, // Use the enum-compatible value
//     };


//     // Convert the async S3 operation to an Observable
//     //return firstValueFrom(
//       await this.s3Client
//         .send(new PutObjectCommand({
//           Bucket: "kenwide",
//           Body: file,
//           Key: "tests/" + file.name,
//           ACL: 'public-read',
//         }))


//         // .then((response) => {
//         //   console.log("RESPONSE", response);
//         //   // Construct the file URL
//         //   //return `https://objectstore.nyc1.civo.com/kenwide/${file.name}`;
//         // })
//         // .catch((error) => {
//         //   throw new Error(`Upload failed: ${error.message}`);
//         // })
//    // );
//   }
// }


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
  private readonly FOLDER_NAME = 'tests/';
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'nyc-1',
      endpoint: 'https://objectstore.nyc1.civo.com',
      credentials: {
        accessKeyId: 'DMLRUYZY3H7P0UOAB21P', // ⚠️ Replace with env variables in production
        secretAccessKey: '9UEAxFEcUGdxPIHghKpCZaCWubNBo7JDzBpA5PNT', // ⚠️ Replace with env variables
      },
      forcePathStyle: true,
    });
  }

  /** Upload file to "tests/" folder */
  async uploadFile(file: File): Promise<void> {
    const params: PutObjectCommandInput = {
      Bucket: this.BUCKET_NAME,
      Key: this.FOLDER_NAME + file.name,
      Body: file,
      ACL: ObjectCannedACL.public_read,
    };

    await this.s3Client.send(new PutObjectCommand(params));
    console.log(`✅ Uploaded: ${file.name}`);
  }

  /** List all files in "tests/" */
  async listTestFiles(): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.BUCKET_NAME,
      Prefix: this.FOLDER_NAME,
    });

    const response = await this.s3Client.send(command);
    const fileKeys = response.Contents?.map((obj) => obj.Key!).filter(Boolean) || [];

    console.log('📂 Files found:', fileKeys);
    return fileKeys;
  }

  /** Delete one file by name */
  async deleteTestFile(fileName: string): Promise<void> {
    const key = this.FOLDER_NAME + fileName;
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
    });

    await this.s3Client.send(command);
    console.log(`🗑️ Deleted file: ${fileName}`);
  }

  /** Delete all files in "tests/" */
  async deleteAllTestFiles(): Promise<void> {
    const fileKeys = await this.listTestFiles();
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
    console.log('🧹 All files deleted from tests/');
  }
}

