import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, docData, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore: Firestore = inject(Firestore);

    // Generic get collection
    getCollection<T>(path: string): Observable<T[]> {
        const colRef = collection(this.firestore, path);
        return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
    }

    // Generic get document
    getDoc<T>(path: string, id: string): Observable<T> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return docData(docRef, { idField: 'id' }) as Observable<T>;
    }

    // Generic add document
    addDoc<T>(path: string, data: any): Promise<any> {
        const colRef = collection(this.firestore, path);
        return addDoc(colRef, data);
    }

    // Generic update document
    updateDoc(path: string, id: string, data: any): Promise<void> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return updateDoc(docRef, data);
    }

    // Generic delete document
    deleteDoc(path: string, id: string): Promise<void> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return deleteDoc(docRef);
    }
}
