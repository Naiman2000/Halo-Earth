import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, docData, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore: Firestore = inject(Firestore);

    // Generic get collection
    getCollection<T>(path: string): Observable<T[]> {
        try {
            const colRef = collection(this.firestore, path);
            return collectionData(colRef, { idField: 'id' }).pipe(
                tap(data => {
                    // Log for debugging - remove in production if needed
                    console.log(`Loaded ${data.length} items from ${path}`);
                }),
                catchError(error => {
                    console.error(`Error loading collection ${path}:`, error);
                    return of([]);
                })
            ) as Observable<T[]>;
        } catch (error) {
            console.error(`Error creating collection reference for ${path}:`, error);
            return of([]);
        }
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
