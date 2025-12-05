import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
    content?: string;
    tags?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private articles: Article[] = [
        {
            id: '1',
            title: 'Breakthrough in Coral Restoration Techniques',
            excerpt:
                'Scientists have developed a new method to accelerate coral growth, potentially revolutionizing reef restoration efforts worldwide.',
            author: 'Dr. Sarah Mitchell',
            date: 'November 25, 2025',
            category: 'Research',
            image: 'https://images.unsplash.com/photo-1602144586073-f087bceef9ae?w=600',
            readTime: '5 min read',
            content: `
        <h2>A New Hope for Reefs</h2>
        <p>Researchers at the Marine Institute have unveiled a groundbreaking technique that increases coral growth rates by up to 50%. This method involves a combination of micro-fragmentation and controlled water chemistry adjustments.</p>
        <p>"This is a game-changer," says Dr. Mitchell. "We can now restore damaged reefs in a fraction of the time it used to take."</p>
        <h2>How It Works</h2>
        <p>The process starts by breaking corals into tiny pieces, which stimulates rapid tissue growth. These fragments are then placed in tanks with optimized pH and nutrient levels.</p>
        <ul>
            <li>Accelerated calcification</li>
            <li>Higher survival rates</li>
            <li>Scalable for large restoration projects</li>
        </ul>
      `,
            tags: ['Coral', 'Restoration', 'Science']
        },
        {
            id: '2',
            title: 'The Impact of Climate Change on Coral Reefs',
            excerpt:
                'Understanding how rising ocean temperatures affect coral ecosystems and what we can do to protect these vital habitats.',
            author: 'Dr. James Rodriguez',
            date: 'November 20, 2025',
            category: 'Climate',
            image: 'https://images.unsplash.com/photo-1702872555330-ad007317dac8?w=600',
            readTime: '7 min read',
            content: `
        <h2>Rising Temperatures, Bleaching Reefs</h2>
        <p>As global temperatures rise, our oceans are absorbing much of the excess heat. This causes coral bleaching, a stress response where corals expel the symbiotic algae living in their tissues.</p>
        <p>Without these algae, corals lose their color and their main source of food, leaving them vulnerable to disease and death.</p>
      `,
            tags: ['Climate Change', 'Ocean Warming', 'Bleaching']
        },
        {
            id: '3',
            title: 'Meet the Marine Biologists Saving Our Reefs',
            excerpt:
                'An inside look at the dedicated scientists working tirelessly to protect and restore coral reefs around the world.',
            author: 'Emily Carter',
            date: 'November 15, 2025',
            category: 'People',
            image: 'https://images.unsplash.com/photo-1715028045565-6cb2fdacd12c?w=600',
            readTime: '6 min read',
            content: '<p>Content coming soon...</p>',
            tags: ['People', 'Scientists', 'Conservation']
        },
        {
            id: '4',
            title: 'How to Reduce Your Impact on Ocean Health',
            excerpt:
                'Simple lifestyle changes that can make a big difference in protecting coral reefs and marine ecosystems.',
            author: 'Michael Chen',
            date: 'November 10, 2025',
            category: 'Conservation',
            image: 'https://images.unsplash.com/photo-1708864162641-c748729de0b3?w=600',
            readTime: '4 min read',
            content: '<p>Content coming soon...</p>',
            tags: ['Lifestyle', 'Sustainability', 'Ocean']
        },
        {
            id: '5',
            title: 'Biodiversity Hotspots: Coral Reef Ecosystems',
            excerpt:
                'Exploring the incredible diversity of life that depends on healthy coral reefs and why protecting them matters.',
            author: 'Dr. Lisa Thompson',
            date: 'November 5, 2025',
            category: 'Education',
            image: 'https://images.unsplash.com/photo-1722482312877-dda06fc3c23d?w=600',
            readTime: '8 min read',
            content: '<p>Content coming soon...</p>',
            tags: ['Biodiversity', 'Ecosystems', 'Marine Life']
        },
        {
            id: '6',
            title: 'Success Stories: Reefs That Are Bouncing Back',
            excerpt:
                'Inspiring examples of coral reef restoration projects that are showing remarkable results and giving us hope.',
            author: 'Amanda Roberts',
            date: 'October 30, 2025',
            category: 'Success Stories',
            image: 'https://images.unsplash.com/photo-1573597892261-813c3ffdc40b?w=600',
            readTime: '6 min read',
            content: '<p>Content coming soon...</p>',
            tags: ['Success', 'Restoration', 'Hope']
        }
    ];

    constructor() { }

    getArticles(): Observable<Article[]> {
        return of(this.articles);
    }

    getArticleById(id: string): Observable<Article | undefined> {
        return of(this.articles.find(a => a.id === id));
    }

    getRelatedArticles(category: string, currentId: string): Observable<Article[]> {
        return of(this.articles
            .filter(a => a.category === category && a.id !== currentId)
            .slice(0, 3));
    }
}
