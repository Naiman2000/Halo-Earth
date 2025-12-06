import { Timestamp } from '@angular/fire/firestore';

export type PaymentStatus = 'unverified' | 'verified';

export interface Donation {
    id?: string;
    amount: number;
    donorName?: string;
    donorEmail?: string;
    message?: string;
    date: Timestamp;
    programId?: string; // Optional link to a specific program
    reference?: string; // Donation reference number
    status?: PaymentStatus; // Payment verification status
}
