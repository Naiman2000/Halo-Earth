import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '../../../models/article.model';
import { ArticleService } from '../../../services/article.service';
import { StorageService } from '../../../services/storage.service';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-article-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-management.html',
  styleUrl: './article-management.scss',
})
export class ArticleManagement implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchTerm = '';
  isLoading = true;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  
  currentArticle: Article = this.getEmptyArticle();
  // TODO: Firebase Storage Setup Required - Uncomment when ready
  // selectedImageFile: File | null = null;
  // imagePreview: string | null = null;
  // isUploadingImage = false;
  selectedImageFile: File | null = null; // Kept for type safety, not used when upload is disabled
  imagePreview: string | null = null; // Kept for type safety, not used when upload is disabled
  isUploadingImage = false; // Kept for type safety, not used when upload is disabled

  categories = [
    'Research',
    'Climate',
    'Conservation',
    'Education',
    'People',
    'Success Stories'
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  private auth = inject(Auth);
  private router = inject(Router);

  constructor(
    private articleService: ArticleService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  getEmptyArticle(): Article {
    return {
      title: '',
      content: '',
      excerpt: '',
      author: '',
      authorId: 'admin',
      publishedAt: Timestamp.now(),
      category: 'Research',
      image: '',
      readTime: '',
      tags: []
    };
  }

  loadArticles(): void {
    this.isLoading = true;
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.filteredArticles = [...this.articles];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
      }
    });
  }

  filterArticles(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(term) ||
      article.excerpt.toLowerCase().includes(term) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
  }

  get paginatedArticles(): Article[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredArticles.slice(start, end);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.currentArticle = this.getEmptyArticle();
    // TODO: Firebase Storage Setup Required
    // this.selectedImageFile = null;
    // this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(article: Article): void {
    this.modalMode = 'edit';
    this.currentArticle = { ...article };
    // TODO: Firebase Storage Setup Required
    // this.selectedImageFile = null;
    // this.imagePreview = article.image || article.imageUrl || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    // TODO: Firebase Storage Setup Required
    // this.selectedImageFile = null;
    // this.imagePreview = null;
  }

  // TODO: Firebase Storage Setup Required
  // File upload functionality is currently disabled.
  // To enable file uploads:
  // 1. Set up Firebase Storage in Firebase Console
  // 2. Deploy storage rules: firebase deploy --only storage
  // 3. Uncomment the methods below

  // onImageSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     
  //     // Validate file type
  //     if (!file.type.startsWith('image/')) {
  //       alert('Please select an image file');
  //       return;
  //     }
  //     
  //     // Validate file size (max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert('Image size should be less than 5MB');
  //       return;
  //     }
  //     
  //     this.selectedImageFile = file;
  //     
  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imagePreview = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // removeSelectedImage(): void {
  //   this.selectedImageFile = null;
  //   this.imagePreview = null;
  //   if (this.modalMode === 'add') {
  //     this.currentArticle.image = '';
  //   }
  // }

  // async uploadImageToFirebase(): Promise<string | null> {
  //   if (!this.selectedImageFile) {
  //     return null;
  //   }

  //   // Check if user is authenticated
  //   const user = this.auth.currentUser;
  //   if (!user) {
  //     alert('You must be logged in to upload images. Please log in and try again.');
  //     this.router.navigate(['/admin/login']);
  //     return null;
  //   }

  //   this.isUploadingImage = true;
  //   try {
  //     const timestamp = Date.now();
  //     // Sanitize filename to avoid issues
  //     const sanitizedFileName = this.selectedImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  //     const fileName = `articles/${timestamp}_${sanitizedFileName}`;
  //     
  //     const downloadURL = await firstValueFrom(this.storageService.uploadImage(this.selectedImageFile, fileName));
  //     this.isUploadingImage = false;
  //     return downloadURL || null;
  //   } catch (error: any) {
  //     console.error('Error uploading image:', error);
  //     this.isUploadingImage = false;
  //     
  //     // Provide more specific error messages
  //     let errorMessage = 'Failed to upload image. ';
  //     if (error?.code === 'storage/unauthorized') {
  //       errorMessage += 'You are not authorized to upload. Please check your login status.';
  //     } else if (error?.code === 'storage/canceled') {
  //       errorMessage += 'Upload was canceled.';
  //     } else if (error?.code === 'storage/unknown') {
  //       errorMessage += 'An unknown error occurred. Please check your Firebase Storage configuration and rules.';
  //     } else {
  //       errorMessage += 'Please ensure you are logged in and try again.';
  //     }
  //     
  //     alert(errorMessage);
  //     return null;
  //   }
  // }

  async saveArticle(): Promise<void> {
    // TODO: Firebase Storage Setup Required
    // File upload functionality is currently disabled.
    // Uncomment the code below after setting up Firebase Storage.
    
    // Upload image if a new file is selected
    // if (this.selectedImageFile) {
    //   const imageUrl = await this.uploadImageToFirebase();
    //   if (imageUrl) {
    //     this.currentArticle.image = imageUrl;
    //   } else {
    //     // If upload failed, don't save the article
    //     return;
    //   }
    // }

    if (this.modalMode === 'add') {
      this.articleService.createArticle(this.currentArticle).then(() => {
        this.loadArticles();
        this.closeModal();
      }).catch(error => {
        console.error('Error creating article:', error);
        alert('Failed to create article. Please try again.');
      });
    } else {
      if (this.currentArticle.id) {
        this.articleService.updateArticle(this.currentArticle.id, this.currentArticle).then(() => {
          this.loadArticles();
          this.closeModal();
        }).catch(error => {
          console.error('Error updating article:', error);
          alert('Failed to update article. Please try again.');
        });
      }
    }
  }

  deleteArticle(article: Article): void {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      if (article.id) {
        this.articleService.deleteArticle(article.id).then(() => {
          this.loadArticles();
        }).catch(error => {
          console.error('Error deleting article:', error);
        });
      }
    }
  }

  formatDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Handle tags as comma-separated string for input
  get tagsString(): string {
    return this.currentArticle.tags?.join(', ') || '';
  }

  set tagsString(value: string) {
    this.currentArticle.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
