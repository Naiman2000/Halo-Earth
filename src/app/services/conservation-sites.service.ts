import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';

export interface ConservationSite {
    id?: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    status: 'active' | 'expanding';
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConservationSitesService {
    private firestoreService = inject(FirestoreService);
    private collectionPath = 'conservation-sites';

    getSites(): Observable<ConservationSite[]> {
        return this.firestoreService.getCollection<ConservationSite>(this.collectionPath);
    }

    async addSite(site: ConservationSite): Promise<void> {
        await this.firestoreService.addDoc(this.collectionPath, site);
    }
}

