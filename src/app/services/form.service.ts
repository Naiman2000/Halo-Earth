import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { FormSubmission } from '../models/form.model';

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private firestoreService = inject(FirestoreService);
    private collectionPath = 'forms';

    async submitForm(submission: FormSubmission): Promise<void> {
        await this.firestoreService.addDoc(this.collectionPath, submission);
    }
}
