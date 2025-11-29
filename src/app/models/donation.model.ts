import { Timestamp } from '@angular/fire/firestore';

export interface Donation {
    id?: string;
    amount: number;
    donorName?: string;
    donorEmail?: string;
    message?: string;
    date: Timestamp;
    programId?: string; // Optional link to a specific program
}
