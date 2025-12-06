import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Article } from '../models/article.model';
import { FirestoreService } from './firestore.service';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private readonly collectionPath = 'articles';

    constructor(private firestoreService: FirestoreService) { }

    private formatDate(timestamp: Timestamp | any): string {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    }

    private transformArticleForDisplay(article: any): Article {
        if (!article) {
            throw new Error('Article data is required');
        }
        
        return {
            id: article.id,
            title: article.title || '',
            content: article.content || '',
            excerpt: article.excerpt || '',
            author: article.author || '',
            authorId: article.authorId || 'admin',
            publishedAt: article.publishedAt || Timestamp.now(),
            date: article.publishedAt ? this.formatDate(article.publishedAt) : undefined,
            category: article.category || 'Research',
            image: article.image || article.imageUrl || '',
            imageUrl: article.image || article.imageUrl,
            readTime: article.readTime || '',
            tags: article.tags || []
        };
    }

    private transformArticleForStorage(article: Partial<Article>): any {
        const { date, imageUrl, ...rest } = article;
        return {
            ...rest,
            image: article.image || article.imageUrl || '',
            publishedAt: article.publishedAt || Timestamp.now()
        };
    }

    getArticles(): Observable<Article[]> {
        return this.firestoreService.getCollection<Article>(this.collectionPath).pipe(
            map(articles => {
                if (!articles || articles.length === 0) {
                    return [];
                }
                return articles
                    .filter(article => article != null)
                    .map(article => {
                        try {
                            return this.transformArticleForDisplay(article);
                        } catch (error) {
                            console.error('Error transforming article:', error, article);
                            return null;
                        }
                    })
                    .filter((article): article is Article => article !== null);
            }),
            catchError(error => {
                console.error('Error fetching articles:', error);
                return of([]);
            })
        );
    }

    getArticleById(id: string): Observable<Article | undefined> {
        if (!id) {
            return of(undefined);
        }
        return this.firestoreService.getDoc<Article>(this.collectionPath, id).pipe(
            map(article => {
                if (!article) {
                    return undefined;
                }
                try {
                    return this.transformArticleForDisplay(article);
                } catch (error) {
                    console.error('Error transforming article:', error, article);
                    return undefined;
                }
            }),
            catchError(error => {
                console.error('Error fetching article:', error);
                return of(undefined);
            })
        );
    }

    createArticle(article: Partial<Article>): Promise<any> {
        const articleData = this.transformArticleForStorage({
            ...article,
            publishedAt: Timestamp.now()
        });
        return this.firestoreService.addDoc(this.collectionPath, articleData);
    }

    updateArticle(id: string, article: Partial<Article>): Promise<void> {
        const articleData = this.transformArticleForStorage(article);
        return this.firestoreService.updateDoc(this.collectionPath, id, articleData);
    }

    deleteArticle(id: string): Promise<void> {
        return this.firestoreService.deleteDoc(this.collectionPath, id);
    }

    getRelatedArticles(category: string, currentId: string): Observable<Article[]> {
        return this.getArticles().pipe(
            map(articles => articles
                .filter(a => a.category === category && a.id !== currentId)
                .slice(0, 3))
        );
    }
}
