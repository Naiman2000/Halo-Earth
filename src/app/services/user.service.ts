import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestoreService = inject(FirestoreService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private collectionPath = 'users';

  getUsers(): Observable<User[]> {
    return this.firestoreService.getCollection<User>(this.collectionPath).pipe(
      map(users => users.filter(user => user.active !== false))
    );
  }

  getUser(id: string): Observable<User | undefined> {
    return this.firestoreService.getDoc<User>(this.collectionPath, id).pipe(
      map(user => user || undefined)
    );
  }

  async createUser(email: string, password: string, displayName: string, role: UserRole = 'admin'): Promise<string> {
    // Check if current user is super admin
    if (!this.authService.canCreateUsers()) {
      throw new Error('Only super admins can create users');
    }

    // Get current user info before creating new user
    // Note: createUserWithEmailAndPassword will sign in the newly created user,
    // which will sign out the current super admin. This is a limitation of Firebase Auth client SDK.
    // In production, this should be done via Firebase Admin SDK on the backend.
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    const createdBy = currentUser.uid;

    // Create Firebase Auth user (this will sign in the new user and sign out the super admin)
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email,
      displayName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: createdBy,
      active: true
    };

    const userDocRef = doc(this.firestore, `${this.collectionPath}/${uid}`);
    await setDoc(userDocRef, userData);

    // Note: The super admin is now signed out. They will need to sign back in.
    // This is a known limitation when using Firebase Auth client SDK.
    // For production, implement user creation via Firebase Admin SDK on a backend service.

    return uid;
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    // Check if current user is super admin
    if (!this.authService.canCreateUsers()) {
      throw new Error('Only super admins can update users');
    }

    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    // Don't allow changing role to super-admin unless current user is super-admin
    const currentUserData = this.authService.getUserData();
    if (data.role === 'super-admin' && currentUserData?.role !== 'super-admin') {
      throw new Error('Only super admins can assign super-admin role');
    }

    await this.firestoreService.updateDoc(this.collectionPath, id, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    // Check if current user is super admin
    if (!this.authService.canCreateUsers()) {
      throw new Error('Only super admins can delete users');
    }

    // Don't allow deleting yourself
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.uid === id) {
      throw new Error('Cannot delete your own account');
    }

    // Soft delete by setting active to false
    await this.firestoreService.updateDoc(this.collectionPath, id, {
      active: false,
      updatedAt: serverTimestamp()
    });
  }

  async resetUserPassword(email: string): Promise<void> {
    // This would typically use Firebase Admin SDK on the backend
    // For now, we'll just throw an error indicating it needs backend implementation
    throw new Error('Password reset must be implemented on the backend using Firebase Admin SDK');
  }
}

