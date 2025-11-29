import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storage: Storage = inject(Storage);

    uploadImage(file: File, path: string): Observable<string> {
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytes(storageRef, file);

        return from(uploadTask).pipe(
            switchMap((result) => getDownloadURL(result.ref))
        );
    }
}
