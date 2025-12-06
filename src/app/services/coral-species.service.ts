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

    addCoral(coral: CoralSpecies): Promise<string> {
        return this.firestoreService.addDoc(this.collectionPath, coral).then(ref => ref.id);
    }

    updateCoral(id: string, coral: Partial<CoralSpecies>): Promise<void> {
        return this.firestoreService.updateDoc(this.collectionPath, id, coral);
    }

    deleteCoral(id: string): Promise<void> {
        return this.firestoreService.deleteDoc(this.collectionPath, id);
    }
}

