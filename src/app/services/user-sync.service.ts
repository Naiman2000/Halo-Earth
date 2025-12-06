import { Injectable, inject } from '@angular/core';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserSyncService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /**
   * Creates or updates the current user's document in Firestore
   * Call this after login to ensure the user document exists
   */
  async syncCurrentUser(role: UserRole = 'admin'): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData: Omit<User, 'id'> = {
        email: currentUser.email || '',
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin User',
        role: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        active: true
      };

      await setDoc(userDocRef, userData);
      console.log('User document created in Firestore:', currentUser.uid);
    } else {
      // Update email if it has changed
      const existingData = userDoc.data();
      if (existingData['email'] !== currentUser.email) {
        await setDoc(userDocRef, {
          email: currentUser.email || '',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }
  }

  /**
   * Manually create a user document for a specific Firebase Auth UID
   * Use this to create the first super-admin user
   */
  async createUserDocument(uid: string, email: string, displayName: string, role: UserRole): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      throw new Error('User document already exists');
    }

    const userData: Omit<User, 'id'> = {
      email: email,
      displayName: displayName,
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true
    };

    await setDoc(userDocRef, userData);
    console.log('User document created:', uid);
  }

  /**
   * Update the role of an existing user
   */
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User document does not exist');
    }

    await setDoc(userDocRef, {
      role: role,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('User role updated:', uid, role);
  }
}

