import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { RATINGS, VIDEO_CATEGORIES } from '../../../shared/constants/app.constants';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../../shared/services/error-handler-service';
import { VideoService } from '../../../shared/services/video-service';
import { NotificationService } from '../../../shared/services/notification-service';
import { MediaService } from '../../../shared/services/media-service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-manage-video',
  standalone: false,
  templateUrl: './manage-video.html',
  styleUrl: './manage-video.css',
})
export class ManageVideo implements OnInit{

  isSaving = false;

  uploadProgress = 0;
  posterProgress = 0;

  categoriesAll = VIDEO_CATEGORIES;
  ratings = RATINGS;

  videoForm: any;

  videoPreviewUrl: string | null = null;
  posterPreviewUrl: string | null = null;

  videoLoading = false;
  posterLoading = false;

  isEditMode = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    private videoService: VideoService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    private mediaService: MediaService,
    private dialogRef: MatDialogRef<ManageVideo>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.mode === 'edit';

    this.videoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      rating: ['', Validators.required],
      categories: [[], [Validators.required, ManageVideo.arrayNotEmpty]],
      duration: [0],
      src: ['', [Validators.required]],
      poster: ['', [Validators.required]],
      published: [false]
    });
  }


  static arrayNotEmpty(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!Array.isArray(value) || value.length === 0) {
      return { required: true };
    }
    return null;
  }


  private loadVideoPreview(uuid: string): void {
    this.videoPreviewUrl = this.mediaService.getMediaUrl(uuid, 'video');
    this.videoLoading = false;
    this.cdr.detectChanges();
  }

  private loadPosterPreview(uuid: string): void {
    this.posterPreviewUrl = this.mediaService.getMediaUrl(uuid, 'image');
    this.posterLoading = false;
    this.cdr.detectChanges();
  }
   private extractUuidFromUrl(value?: string | null): string {
    if (!value) return '';
    if (!value.includes('/')) return value;
    const segments = value.split('/');
    return segments[segments.length - 1] ?? '';
  }



  ngOnInit(): void {
    if (this.isEditMode){

    const video = this.data.video;

    this.videoForm.patchValue({
      title: video.title,
      description: video.description,
      year: video.year,
      rating: video.rating,
      categories: video.categories || [],
      duration: video.duration,
      src: this.extractUuidFromUrl(video.src),
      poster: this.extractUuidFromUrl(video.poster),
      published: video.published
    });

    if (video.src) {
      this.loadVideoPreview(video.src);
    }

    if (video.poster) {
      this.loadPosterPreview(video.poster);
    }
  }
  }
  /* -------------------- Validators -------------------- */

  

  /* -------------------- Preview Loaders -------------------- */

  

  /* -------------------- Helpers -------------------- */

 

  /* -------------------- Video Upload -------------------- */

  onVideoPicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const validExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.mpeg', '.mpg', '.ogg'  ];
    const fileName = file.name.toLowerCase();

    const hasValidExtension = validExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    const hasValidMimeType =
      file.type.startsWith('video/') ||
      file.type === 'application/octet-stream';

    if (!hasValidExtension || !hasValidMimeType) {
      this.notification.error('Please select a valid video file (MP4 or MKV)');
      return;
    }

    const localBlobUrl = URL.createObjectURL(file);
    this.videoPreviewUrl = localBlobUrl;

    this.extractDurationFromFile(file);
    this.uploadProgress = 0;

    this.mediaService.uploadFile(file).subscribe({
      next: ({ progress, uuid }) => {
        this.uploadProgress = progress;
        if (uuid) {
          this.videoForm.patchValue({ src: uuid });
          this.notification.success('Video uploaded successfully');
        }
      },
      error: () => {
        this.notification.error('Failed to upload video. Please try again.');
        this.uploadProgress = 0;
        URL.revokeObjectURL(localBlobUrl);
        this.videoPreviewUrl = null;
      }
    });
  }

  /* -------------------- Poster Upload -------------------- */

  onPosterPicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.notification.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.posterPreviewUrl = e.target?.result as string;
      this.cdr.detectChanges();
    }
    reader.readAsDataURL(file);

    this.posterProgress = 0;

    this.mediaService.uploadFile(file).subscribe({
      next: ({ progress, uuid }) => {
        this.posterProgress = progress;
        if (uuid) {
          this.videoForm.patchValue({ poster: uuid });
          this.notification.success('Poster uploaded successfully');
        }
      },
      error: () => {
        this.notification.error('Failed to upload poster. Please try again.');
        this.posterProgress = 0;
        this.posterPreviewUrl = null;
      }
    });
  }

  /* -------------------- Duration -------------------- */

  private extractDurationFromFile(file: File): void {
    const video = document.createElement('video');
    video.preload = 'metadata';

    const blobUrl = URL.createObjectURL(file);
    video.src = blobUrl;

    video.onloadedmetadata = () => {
      const duration = isFinite(video.duration)
        ? Math.round(video.duration)
        : 0;

      this.videoForm.patchValue({ duration });
      URL.revokeObjectURL(blobUrl);
    };

    video.onerror = err => {
      console.error('Error extracting video duration', err);
      URL.revokeObjectURL(blobUrl);
    };
  }

  /* -------------------- Save -------------------- */

  onSave(): void {
    if (this.videoForm.invalid) {
      this.videoForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.videoForm.value;

    const op$ = this.isEditMode
      ? this.videoService.updateVideoByAdmin(this.data.video.id, payload)
      : this.videoService.createVideoByAdmin(payload);

    op$.subscribe({
      next: (response: any) => {
        this.isSaving = false;
        this.notification.success(response?.message || 'Video saved successfully');
        this.dialogRef.close(true);
      },
      error: err => {
        this.isSaving = false;
        this.errorHandlerService.handle(err, 'Failed to save video');
      }
    });
  }

  /* -------------------- Cleanup -------------------- */

  


  removeVideo(){

if(this.videoPreviewUrl &&  this.videoPreviewUrl.startsWith('blob:')){

URL.revokeObjectURL(this.videoPreviewUrl);

}
 this.videoPreviewUrl = null;
    this.videoForm.patchValue({ src: '', duration: 0 });
    this.uploadProgress = 0;

}


removePoster(): void {
    if(this.posterPreviewUrl &&  this.posterPreviewUrl.startsWith('blob:')){

URL.revokeObjectURL(this.posterPreviewUrl);

}
    
    
    
    this.posterPreviewUrl = null;
    this.videoForm.patchValue({ poster: '' });
    this.posterProgress = 0;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
