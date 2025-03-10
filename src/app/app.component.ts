import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { CommonModule } from '@angular/common';
import { UploadService } from './services/upload.service';
import { UpdatesComponent } from "./updates/updates.component";

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, FileUploadComponent, CommonModule, UpdatesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UploadService]
})
export class AppComponent {
  title = 'upload-notify';
}
