import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  donationGoal: number;
  currentDonations: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private firestore = inject(Firestore);
  private settingsSubject = new BehaviorSubject<SiteSettings | null>(null);
  
  // Observable for components to subscribe to
  settings$ = this.settingsSubject.asObservable();

  // Firestore document reference
  private readonly SETTINGS_DOC = 'config/site-settings';

  constructor() {
    // Load settings on service initialization
    this.loadSettings();
  }

  /**
   * Get default settings (fallback)
   */
  private getDefaultSettings(): SiteSettings {
    return {
      siteName: 'Halo Earth',
      tagline: 'Protecting Our Oceans, One Coral at a Time',
      description: 'Halo Earth is dedicated to coral conservation and marine ecosystem restoration.',
      contactEmail: 'info@haloearth.org',
      contactPhone: '+1 (555) 123-4567',
      address: '123 Ocean Drive, Coastal City, CC 12345',
      facebookUrl: 'https://facebook.com/haloearth',
      twitterUrl: 'https://twitter.com/haloearth',
      instagramUrl: 'https://instagram.com/haloearth',
      linkedinUrl: 'https://linkedin.com/company/haloearth',
      bankName: 'Ocean Bank',
      accountNumber: '1234567890',
      accountName: 'Halo Earth Foundation',
      donationGoal: 60000,
      currentDonations: 45280,
      maintenanceMode: false,
      allowRegistration: true
    };
  }

  /**
   * Load settings from Firestore
   */
  loadSettings(): void {
    const docRef = doc(this.firestore, this.SETTINGS_DOC);
    
    from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return docSnap.data() as SiteSettings;
        } else {
          // Return defaults if no settings exist
          return this.getDefaultSettings();
        }
      }),
      catchError(error => {
        console.error('Error loading settings:', error);
        // Return defaults on error
        return [this.getDefaultSettings()];
      })
    ).subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  /**
   * Get settings as Observable (real-time updates)
   */
  getSettings(): Observable<SiteSettings> {
    const docRef = doc(this.firestore, this.SETTINGS_DOC);
    return docData(docRef).pipe(
      map(data => data as SiteSettings || this.getDefaultSettings()),
      catchError(() => [this.getDefaultSettings()])
    );
  }

  /**
   * Get current settings value (synchronous)
   */
  getCurrentSettings(): SiteSettings {
    return this.settingsSubject.value || this.getDefaultSettings();
  }

  /**
   * Save settings to Firestore
   */
  async saveSettings(settings: SiteSettings): Promise<void> {
    const docRef = doc(this.firestore, this.SETTINGS_DOC);
    
    try {
      await setDoc(docRef, settings, { merge: true });
      this.settingsSubject.next(settings);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Update specific setting fields
   */
  async updateSettings(partialSettings: Partial<SiteSettings>): Promise<void> {
    const currentSettings = this.getCurrentSettings();
    const updatedSettings = { ...currentSettings, ...partialSettings };
    await this.saveSettings(updatedSettings);
  }

  /**
   * Reset to default settings
   */
  async resetToDefaults(): Promise<void> {
    await this.saveSettings(this.getDefaultSettings());
  }
}
