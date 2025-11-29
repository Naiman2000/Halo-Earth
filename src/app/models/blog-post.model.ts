import { Timestamp } from '@angular/fire/firestore';

export interface BlogPost {
    id?: string;
    title: string;
    content: string;
    authorId: string;
    publishedAt: Timestamp;
    tags?: string[];
    imageUrl?: string;
}
