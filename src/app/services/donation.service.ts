import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Donation } from '../models/donation.model';

@Injectable({
    providedIn: 'root'
})
export class DonationService {
    private firestoreService = inject(FirestoreService);
    private collectionPath = 'donations';

    async createDonation(donation: Donation): Promise<string> {
        const reference = this.generateReference();
        const donationWithRef = { ...donation, reference };

        await this.firestoreService.addDoc(this.collectionPath, donationWithRef);
        return reference;
    }

    private generateReference(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `DON-${timestamp}-${random}`;
    }
}
