import { Timestamp } from '@angular/fire/firestore';

export interface Article {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    authorId: string;
    publishedAt: Timestamp;
    date?: string; // Formatted date string for display
    category: string;
    image: string;
    imageUrl?: string; // Alias for image
    readTime: string;
    tags?: string[];
}
