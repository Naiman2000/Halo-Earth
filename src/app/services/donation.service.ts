import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Donation } from '../models/donation.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DonationService {
    private firestoreService = inject(FirestoreService);
    private collectionPath = 'donations';

    getDonations(): Observable<Donation[]> {
        return this.firestoreService.getCollection<Donation>(this.collectionPath);
    }

    async createDonation(donation: Donation): Promise<string> {
        const reference = this.generateReference();
        const donationWithRef = { 
            ...donation, 
            reference,
            status: donation.status || 'unverified' // Default to unverified if not specified
        };

        await this.firestoreService.addDoc(this.collectionPath, donationWithRef);
        return reference;
    }

    async deleteDonation(id: string): Promise<void> {
        if (!id) {
            throw new Error('Donation ID is required');
        }
        await this.firestoreService.deleteDoc(this.collectionPath, id);
    }

    async updateDonationStatus(id: string, status: 'unverified' | 'verified'): Promise<void> {
        if (!id) {
            throw new Error('Donation ID is required');
        }
        await this.firestoreService.updateDoc(this.collectionPath, id, { status });
    }

    private generateReference(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `DON-${timestamp}-${random}`;
    }
}
