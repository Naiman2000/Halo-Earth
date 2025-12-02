import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { CoralSpecies } from '../models/coral-species.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CoralSpeciesService {
    private firestoreService = inject(FirestoreService);
    private collectionPath = 'coral-species';

    getCoralSpecies(): Observable<CoralSpecies[]> {
        return this.firestoreService.getCollection<CoralSpecies>(this.collectionPath);
    }

    getCoralById(id: string): Observable<CoralSpecies> {
        return this.firestoreService.getDoc<CoralSpecies>(this.collectionPath, id);
    }
}

