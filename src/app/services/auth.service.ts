import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, User as FirebaseUser, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
  private currentUser = signal<FirebaseUser | null>(null);
  private userData = signal<User | null>(null);
  
  isSuperAdmin = computed(() => {
    const user = this.userData();
    return user?.role === 'super-admin';
  });
  
  isAdmin = computed(() => {
    const user = this.userData();
    return user?.role === 'admin' || user?.role === 'super-admin';
  });
  
  canCreateUsers = computed(() => {
    return this.isSuperAdmin();
  });

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.set(user);
      if (user) {
        await this.loadUserData(user.uid);
      } else {
        this.userData.set(null);
      }
    });
  }

  private async loadUserData(uid: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.userData.set({
          id: userDoc.id,
          email: data['email'] || '',
          displayName: data['displayName'] || '',
          role: data['role'] || 'admin',
          createdAt: data['createdAt'],
          updatedAt: data['updatedAt'],
          createdBy: data['createdBy'],
          active: data['active'] !== false
        });
      } else {
        // If user document doesn't exist, create one in Firestore
        const firebaseUser = this.currentUser();
        if (firebaseUser) {
          // Create user document in Firestore
          const userData: Omit<User, 'id'> = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin User',
            role: 'admin', // Default to admin, can be changed to super-admin manually in Firestore
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            active: true
          };

          try {
            await setDoc(userDocRef, userData);
            console.log('User document created in Firestore for:', firebaseUser.email);
            
            // Set the user data after creation
            this.userData.set({
              id: uid,
              ...userData
            });
          } catch (createError) {
            console.error('Error creating user document:', createError);
            // Still set the data locally even if Firestore creation fails
            this.userData.set({
              id: uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'admin',
              active: true
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.userData.set(null);
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.currentUser();
  }

  getUserData(): User | null {
    return this.userData();
  }

  getUserDataObservable(): Observable<User | null> {
    const user = this.currentUser();
    if (!user) {
      return of(null);
    }
    return from(this.loadUserData(user.uid)).pipe(
      map(() => this.userData()),
      catchError(() => of(null))
    );
  }

  async refreshUserData(): Promise<void> {
    const user = this.currentUser();
    if (user) {
      await this.loadUserData(user.uid);
    }
  }
}

