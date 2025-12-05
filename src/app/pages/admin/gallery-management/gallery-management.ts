import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
  uploadedAt: Date;
  size?: number;
}

@Component({
  selector: 'app-gallery-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery-management.html',
  styleUrl: './gallery-management.scss',
})
export class GalleryManagement implements OnInit {
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  searchTerm = '';
  filterCategory = 'all';
  isLoading = true;
  showUploadModal = false;
  showEditModal = false;
  selectedImage: GalleryImage | null = null;
  
  viewMode: 'grid' | 'list' = 'grid';

  categories = [
    'Coral Species',
    'Restoration Work',
    'Team Photos',
    'Events',
    'Underwater',
    'Marine Life',
    'Other'
  ];

  get totalImageSize(): number {
    return this.images.reduce((sum, img) => sum + (img.size || 0), 0);
  }

  // For upload
  newImage: GalleryImage = this.getEmptyImage();
  selectedFiles: FileList | null = null;

  ngOnInit(): void {
    this.loadImages();
  }

  getEmptyImage(): GalleryImage {
    return {
      id: '',
      url: '',
      caption: '',
      category: 'Other',
      uploadedAt: new Date()
    };
  }

  loadImages(): void {
    setTimeout(() => {
      // Mock data - In production, load from Firebase Storage
      this.images = [
        {
          id: '1',
          url: 'https://via.placeholder.com/400x300/5BC0DE/FFFFFF?text=Coral+Reef',
          caption: 'Healthy coral reef ecosystem',
          category: 'Coral Species',
          uploadedAt: new Date('2024-12-01'),
          size: 245000
        },
        {
          id: '2',
          url: 'https://via.placeholder.com/400x300/48CAE4/FFFFFF?text=Restoration',
          caption: 'Team working on coral restoration',
          category: 'Restoration Work',
          uploadedAt: new Date('2024-11-28'),
          size: 312000
        },
        {
          id: '3',
          url: 'https://via.placeholder.com/400x300/667eea/FFFFFF?text=Marine+Life',
          caption: 'Tropical fish in coral habitat',
          category: 'Marine Life',
          uploadedAt: new Date('2024-11-25'),
          size: 189000
        },
        {
          id: '4',
          url: 'https://via.placeholder.com/400x300/f093fb/FFFFFF?text=Event',
          caption: 'Beach cleanup event',
          category: 'Events',
          uploadedAt: new Date('2024-11-20'),
          size: 421000
        }
      ];
      
      this.filteredImages = [...this.images];
      this.isLoading = false;
    }, 500);
  }

  filterImages(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredImages = this.images.filter(image => {
      const matchesSearch = 
        image.caption.toLowerCase().includes(term) ||
        image.category.toLowerCase().includes(term);
      
      const matchesCategory = this.filterCategory === 'all' || image.category === this.filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  openUploadModal(): void {
    this.newImage = this.getEmptyImage();
    this.selectedFiles = null;
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
  }

  uploadImage(): void {
    // In production, this would upload to Firebase Storage
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      // Simulate upload
      const file = this.selectedFiles[0];
      const newImage: GalleryImage = {
        ...this.newImage,
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        size: file.size
      };
      
      this.images.unshift(newImage);
      this.filterImages();
      this.closeUploadModal();
    }
  }

  openEditModal(image: GalleryImage): void {
    this.selectedImage = { ...image };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedImage = null;
  }

  saveEdit(): void {
    if (this.selectedImage) {
      const index = this.images.findIndex(img => img.id === this.selectedImage!.id);
      if (index !== -1) {
        this.images[index] = { ...this.selectedImage };
        this.filterImages();
      }
      this.closeEditModal();
    }
  }

  deleteImage(image: GalleryImage): void {
    if (confirm(`Are you sure you want to delete this image?`)) {
      this.images = this.images.filter(img => img.id !== image.id);
      this.filterImages();
    }
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
