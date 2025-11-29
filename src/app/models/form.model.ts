import { Timestamp } from '@angular/fire/firestore';

export interface FormSubmission {
    id?: string;
    type: 'contact' | 'signup' | 'other';
    data: any;
    submittedAt: Timestamp;
    status: 'new' | 'read' | 'archived';
}
