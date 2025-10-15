import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [NgIf, NgFor],
})
export class FileUploadComponent implements OnInit {
  files: string[] = [];
  message: string | null = null;
  loading = false;

  constructor(private uploadService: UploadService) {}

  async ngOnInit() {
    await this.refreshList();
  }

  async refreshList() {
    this.files = await this.uploadService.listTestFiles();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loading = true;
      this.message = null;

      try {
        await this.uploadService.uploadFile(file);
        this.message = `✅ Uploaded ${file.name}`;
        await this.refreshList();
      } catch (error: any) {
        this.message = `❌ Upload failed: ${error.message}`;
      } finally {
        this.loading = false;
      }
    }
  }

  async deleteFile(fileKey: string) {
    const fileName = fileKey.split('/').pop()!;
    if (!confirm(`Delete ${fileName}?`)) return;

    await this.uploadService.deleteTestFile(fileName);
    await this.refreshList();
  }

  async deleteAll() {
    if (!confirm('Delete ALL files in the tests folder?')) return;

    await this.uploadService.deleteAllTestFiles();
    await this.refreshList();
  }
}

