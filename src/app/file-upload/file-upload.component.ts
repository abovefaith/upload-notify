

import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { NgIf } from '@angular/common';

@Component({
  standalone : true,
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [NgIf]
})
export class FileUploadComponent {
  fileUrl: string | null = null;
  error: string | null = null;

  constructor(private uploadService: UploadService) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

     await this.uploadService.uploadFile(file) //.subscribe({
      //   next: (url) => {
      //     //this.fileUrl = url;
      //     this.error = null;
      //     console.log('File URL:', this.fileUrl);
      //   },
      //   error: (err) => {
      //     this.error = err.message || 'Upload failed';
      //     this.fileUrl = null;
      //     console.error(err);
      //   },
      // });
    }
  }
}
