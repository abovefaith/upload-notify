
     //url will be {BASEURL}/{BUCKETnAME}/{FOLDERNAME}/{FILENAME}.{FILEEXTENSION}
import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, ObjectCannedACL, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Observable, firstValueFrom, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private s3Client: S3Client;

  constructor() {
    // Configure the S3 client for Civo Object Store
    this.s3Client = new S3Client({
      region: 'nyc-1', // Replace with your Civo region if different
      endpoint: 'https://objectstore.nyc1.civo.com', // Replace with your Civo endpoint
      credentials: {
        accessKeyId: 'DMLRUYZY3H7P0UOAB21P', // Replace with your Access Key
        secretAccessKey: '9UEAxFEcUGdxPIHghKpCZaCWubNBo7JDzBpA5PNT', // Replace with your Secret Key
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: File) {
    console.log("file", file);

    const params: PutObjectCommandInput = {
      Bucket: 'kenwide', // Replace with your Civo bucket name
      Key: file.name,
      Body: file,
      ACL:  ObjectCannedACL.public_read, // Use the enum-compatible value
    };


    // Convert the async S3 operation to an Observable
    //return firstValueFrom(
      await this.s3Client
        .send(new PutObjectCommand({
          Bucket: "kenwide",
          Body: file,
          Key: "tests/" + file.name,
          ACL: 'public-read',
        }))


        // .then((response) => {
        //   console.log("RESPONSE", response);
        //   // Construct the file URL
        //   //return `https://objectstore.nyc1.civo.com/kenwide/${file.name}`;
        // })
        // .catch((error) => {
        //   throw new Error(`Upload failed: ${error.message}`);
        // })
   // );
  }
}
