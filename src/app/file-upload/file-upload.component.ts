import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [NgIf, NgFor, FormsModule],
})
export class FileUploadComponent implements OnInit {
  folderName = 'profile_pictures'; // default folder, can be changed dynamically
  // :profile_pictures, kenwide-materials, kenwide-courses,
  files: string[] = [];
  message: string | null = null;
  loading = false;

  constructor(private uploadService: UploadService) {}

  async ngOnInit() {
    await this.refreshList();
  }

  async refreshList() {
    this.files = await this.uploadService.listFiles(this.folderName);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loading = true;
      this.message = null;

      try {
        await this.uploadService.uploadFile(this.folderName, file);
        this.message = `✅ Uploaded ${file.name} to "${this.folderName}"`;
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
    if (!confirm(`Delete ${fileName} from folder "${this.folderName}"?`)) return;

    await this.uploadService.deleteFile(this.folderName, fileName);
    await this.refreshList();
  }

  async deleteAll() {
    if (!confirm(`Delete ALL files in folder "${this.folderName}"?`)) return;

    await this.uploadService.deleteAllFiles(this.folderName);
    await this.refreshList();
  }
}

