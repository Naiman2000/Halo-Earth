import { Timestamp } from '@angular/fire/firestore';

export interface Article {
    id?: string;
    title: string;
    content: string;
    authorId: string;
    publishedAt: Timestamp;
    tags?: string[];
    imageUrl?: string;
}
