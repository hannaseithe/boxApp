import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NasService } from '../../services/nas.service';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css'
})
export class ImageDialogComponent {
  picture = signal('')
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private nas:NasService
  ) {}

  ngOnInit() {
    if (this.data.imageUrl) {
      this.fetchThumbnail(this.data.imageUrl)
    }
  }

  private fetchThumbnail(fileName: string) {
    this.nas.fetchThumbnail(fileName,800).subscribe({
      next: (blob) => {
        this.convertBlobToBase64(blob).then((base64) => {
          this.picture.set(base64)
        });
      },
      error: (error) => console.error(error),
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
