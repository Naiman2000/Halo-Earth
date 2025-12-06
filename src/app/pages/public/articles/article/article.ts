import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '../../../../models/article.model';
import { ArticleService } from '../../../../services/article.service';

@Component({
  selector: 'app-article-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class ArticleDetail implements OnInit {
  articles: Article[] = [];
  isLoading = true;

  categories = [
    'All',
    'Research',
    'Climate',
    'Conservation',
    'Education',
    'People',
    'Success Stories',
  ];

  selectedCategory = 'All';
  searchQuery = '';

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.isLoading = true;
    this.cdr.markForCheck(); // Mark for change detection
    
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles || [];
        this.isLoading = false;
        this.cdr.markForCheck(); // Mark for change detection
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.articles = [];
        this.isLoading = false;
        this.cdr.markForCheck(); // Mark for change detection
      },
      complete: () => {
        // Ensure loading is false even if next didn't fire
        if (this.isLoading) {
          this.isLoading = false;
          this.cdr.markForCheck(); // Mark for change detection
        }
      }
    });
  }

  get filteredArticles(): Article[] {
    return this.articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'All' || article.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  get featuredArticle(): Article | undefined {
    return this.filteredArticles.length > 0 ? this.filteredArticles[0] : undefined;
  }

  get listArticles(): Article[] {
    return this.filteredArticles.length > 0 ? this.filteredArticles.slice(1) : [];
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  viewArticle(id: string) {
    this.router.navigate(['/articles', id]);
  }
}