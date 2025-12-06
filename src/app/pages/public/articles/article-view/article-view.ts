import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Article } from '../../../../models/article.model';
import { ArticleService } from '../../../../services/article.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-article-view',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './article-view.html',
    styleUrl: './article-view.scss'
})
export class ArticleView implements OnInit {
    article$: Observable<Article | undefined> = of(undefined);
    relatedArticles$: Observable<Article[]> = of([]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService
    ) { }

    ngOnInit() {
        this.article$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                if (!id) {
                    return of(undefined);
                }
                return this.articleService.getArticleById(id);
            })
        );

        this.relatedArticles$ = this.article$.pipe(
            switchMap(article => {
                if (article && article.id) {
                    return this.articleService.getRelatedArticles(article.category, article.id);
                }
                return of([]);
            })
        );
    }

    goBack() {
        this.router.navigate(['/articles']);
    }

    handleShare(platform: string) {
        const url = window.location.href;
        const text = 'Check out this article!';
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }
}
