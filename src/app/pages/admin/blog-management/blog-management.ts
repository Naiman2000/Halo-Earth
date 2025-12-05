import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../../models/blog-post.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.scss',
})
export class BlogManagement implements OnInit {
  blogPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  searchTerm = '';
  isLoading = true;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  
  currentPost: BlogPost = this.getEmptyPost();

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  getEmptyPost(): BlogPost {
    return {
      title: '',
      content: '',
      authorId: 'admin',
      publishedAt: Timestamp.now(),
      tags: [],
      imageUrl: ''
    };
  }

  loadBlogPosts(): void {
    setTimeout(() => {
      this.blogPosts = [
        {
          id: '1',
          title: 'Understanding Coral Bleaching: Causes and Solutions',
          content: 'Coral bleaching is a stress response that occurs when corals expel the algae living in their tissues...',
          authorId: 'admin',
          publishedAt: Timestamp.fromDate(new Date('2024-12-01')),
          tags: ['conservation', 'bleaching', 'climate-change'],
          imageUrl: ''
        },
        {
          id: '2',
          title: 'Success Story: Reef Restoration in the Caribbean',
          content: 'Our recent coral restoration project in the Caribbean has shown promising results...',
          authorId: 'admin',
          publishedAt: Timestamp.fromDate(new Date('2024-11-28')),
          tags: ['restoration', 'success-story', 'caribbean'],
          imageUrl: ''
        },
        {
          id: '3',
          title: 'How You Can Help Save Coral Reefs',
          content: 'There are many ways individuals can contribute to coral reef conservation efforts...',
          authorId: 'admin',
          publishedAt: Timestamp.fromDate(new Date('2024-11-25')),
          tags: ['how-to', 'conservation', 'volunteer'],
          imageUrl: ''
        }
      ];
      
      this.filteredPosts = [...this.blogPosts];
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  filterPosts(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPosts = this.blogPosts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }

  get paginatedPosts(): BlogPost[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPosts.slice(start, end);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.currentPost = this.getEmptyPost();
    this.showModal = true;
  }

  openEditModal(post: BlogPost): void {
    this.modalMode = 'edit';
    this.currentPost = { ...post };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePost(): void {
    if (this.modalMode === 'add') {
      const newPost = {
        ...this.currentPost,
        id: Date.now().toString(),
        publishedAt: Timestamp.now()
      };
      this.blogPosts.unshift(newPost);
    } else {
      const index = this.blogPosts.findIndex(p => p.id === this.currentPost.id);
      if (index !== -1) {
        this.blogPosts[index] = { ...this.currentPost };
      }
    }
    
    this.filterPosts();
    this.closeModal();
  }

  deletePost(post: BlogPost): void {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      this.blogPosts = this.blogPosts.filter(p => p.id !== post.id);
      this.filterPosts();
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
    return this.currentPost.tags?.join(', ') || '';
  }

  set tagsString(value: string) {
    this.currentPost.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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
