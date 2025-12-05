# Admin-to-Public Integration Guide

## 🔄 How Admin Changes Reflect on Public Pages

### Current Implementation Status

✅ **CONFIGURED**: The Site Settings page now uses Firebase integration
✅ **SERVICE CREATED**: `SiteSettingsService` connects admin and public pages
✅ **REAL-TIME**: Changes propagate automatically to all public pages

---

## 📋 What Works Now

### Site Settings Integration (READY)

When an admin changes settings in `/admin/settings`:
1. **Saves to Firestore** - Data persists in Firebase database
2. **Updates Observable** - `SiteSettings.settings$` emits new values
3. **Public pages auto-update** - Any subscribed components receive changes instantly

**Firestore Path**: `config/site-settings`

---

## 🎯 How to Use in Public Pages

### Example 1: Display Site Name in Footer

```typescript
// public-footer.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-public-footer',
  template: `
    <footer>
      <h3>{{ siteName }}</h3>
      <p>{{ tagline }}</p>
      <p>Contact: {{ contactEmail }}</p>
    </footer>
  `
})
export class PublicFooterComponent implements OnInit {
  private settingsService = inject(SiteSettingsService);
  
  siteName = '';
  tagline = '';
  contactEmail = '';

  ngOnInit() {
    // Subscribe to settings (auto-updates when admin changes them!)
    this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.siteName = settings.siteName;
        this.tagline = settings.tagline;
        this.contactEmail = settings.contactEmail;
      }
    });
  }
}
```

### Example 2: Display Social Media Links

```typescript
// public-header.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-public-header',
  template: `
    <nav>
      <h1>{{ siteName }}</h1>
      <div class="social-links">
        <a *ngIf="facebookUrl" [href]="facebookUrl" target="_blank">
          <i class="bi bi-facebook"></i>
        </a>
        <a *ngIf="twitterUrl" [href]="twitterUrl" target="_blank">
          <i class="bi bi-twitter"></i>
        </a>
        <a *ngIf="instagramUrl" [href]="instagramUrl" target="_blank">
          <i class="bi bi-instagram"></i>
        </a>
      </div>
    </nav>
  `
})
export class PublicHeaderComponent implements OnInit {
  private settingsService = inject(SiteSettingsService);
  
  siteName = '';
  facebookUrl = '';
  twitterUrl = '';
  instagramUrl = '';

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.siteName = settings.siteName;
        this.facebookUrl = settings.facebookUrl;
        this.twitterUrl = settings.twitterUrl;
        this.instagramUrl = settings.instagramUrl;
      }
    });
  }
}
```

### Example 3: Donation Goal Progress

```typescript
// donation-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-donation-form',
  template: `
    <div class="donation-progress">
      <h3>Help Us Reach Our Goal!</h3>
      <div class="progress">
        <div class="progress-bar" [style.width.%]="progress"></div>
      </div>
      <p>\${{ currentDonations | number }} of \${{ donationGoal | number }}</p>
    </div>
  `
})
export class DonationFormComponent implements OnInit {
  private settingsService = inject(SiteSettingsService);
  
  donationGoal = 0;
  currentDonations = 0;
  progress = 0;

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.donationGoal = settings.donationGoal;
        this.currentDonations = settings.currentDonations;
        this.progress = (this.currentDonations / this.donationGoal) * 100;
      }
    });
  }
}
```

### Example 4: Maintenance Mode Check

```typescript
// app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SiteSettingsService } from './services/site-settings.service';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="maintenanceMode" class="maintenance-banner">
      <i class="bi bi-exclamation-triangle"></i>
      Site is currently under maintenance
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  private settingsService = inject(SiteSettingsService);
  private router = inject(Router);
  
  maintenanceMode = false;

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.maintenanceMode = settings.maintenanceMode;
        
        // Optionally redirect non-admin users to maintenance page
        if (this.maintenanceMode && !this.router.url.includes('/admin')) {
          // this.router.navigate(['/maintenance']);
        }
      }
    });
  }
}
```

---

## 🔧 Extending to Other Admin Pages

### Partner Programs

Create a similar service for partners:

```typescript
// partner.service.ts
@Injectable({ providedIn: 'root' })
export class PartnerService {
  private firestore = inject(Firestore);

  // Get all partners (used by both admin and public)
  getPartners(): Observable<PartnerProgram[]> {
    const colRef = collection(this.firestore, 'partners');
    return collectionData(colRef, { idField: 'id' }) as Observable<PartnerProgram[]>;
  }

  // Add partner (admin only)
  async addPartner(partner: PartnerProgram): Promise<void> {
    const colRef = collection(this.firestore, 'partners');
    await addDoc(colRef, partner);
  }

  // Update partner (admin only)
  async updatePartner(id: string, partner: Partial<PartnerProgram>): Promise<void> {
    const docRef = doc(this.firestore, `partners/${id}`);
    await updateDoc(docRef, partner);
  }

  // Delete partner (admin only)
  async deletePartner(id: string): Promise<void> {
    const docRef = doc(this.firestore, `partners/${id}`);
    await deleteDoc(docRef);
  }
}
```

Then update admin partner-management to use it:

```typescript
// admin/partner-management/partner-management.ts
export class PartnerManagement implements OnInit {
  private partnerService = inject(PartnerService);

  ngOnInit() {
    // Load from Firebase instead of mock data
    this.partnerService.getPartners().subscribe(partners => {
      this.partners = partners;
      this.filteredPartners = [...partners];
    });
  }

  async savePartner() {
    if (this.modalMode === 'add') {
      await this.partnerService.addPartner(this.currentPartner);
    } else {
      await this.partnerService.updatePartner(this.currentPartner.id!, this.currentPartner);
    }
  }

  async deletePartner(partner: PartnerProgram) {
    await this.partnerService.deletePartner(partner.id!);
  }
}
```

And public pages automatically get updates:

```typescript
// public/partner-list/partner-list.ts
export class PartnerList implements OnInit {
  private partnerService = inject(PartnerService);

  partners: PartnerProgram[] = [];

  ngOnInit() {
    // Same service! Gets real-time updates when admin adds/edits partners
    this.partnerService.getPartners().subscribe(partners => {
      this.partners = partners.filter(p => p.isActive); // Only show active
    });
  }
}
```

---

## 📊 The Flow

```
┌─────────────────────┐
│  Admin Changes      │
│  Settings in UI     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SiteSettingsService│
│  .saveSettings()    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Firestore Database │
│  config/site-settings│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Observable Emits   │
│  settings$          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  All Subscribed Components      │
│  (Admin + Public) Auto-Update! │
└─────────────────────────────────┘
```

---

## ✅ Benefits

1. **Single Source of Truth**: One Firestore document, multiple consumers
2. **Real-Time**: Changes propagate instantly (no page refresh needed)
3. **Consistent**: Admin and public use same service
4. **Maintainable**: Change once, update everywhere
5. **Secure**: Firestore rules control who can read/write

---

## 🔒 Security (Firestore Rules)

Add these rules to `/firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Site settings - public read, admin write
    match /config/site-settings {
      allow read: if true;  // Anyone can read settings
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Partners - public read active, admin full access
    match /partners/{partnerId} {
      allow read: if resource.data.isActive == true || 
                    (request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🚀 Quick Start

1. **Firebase is already configured** in the project
2. **Service is created** and ready to use
3. **Admin page is updated** to use the service
4. **Update public components** to inject `SiteSettingsService`
5. **Deploy Firestore rules** for security

---

## 📝 Notes

- **Currently**: Only Site Settings has full Firebase integration
- **To Do**: Connect other admin pages (partners, corals, blog, etc.) using the same pattern
- **Real-time**: All changes are instant - no polling or manual refresh needed
- **Offline**: Firebase SDK handles offline caching automatically

---

## 🎯 Summary

**YES!** Admin changes **DO** reflect on public pages when using the integrated services.

- Site Settings: ✅ **READY** - Fully integrated with Firebase
- Other Pages: 🔄 **PATTERN READY** - Follow the same service pattern

The foundation is built - just replicate the pattern for each data type!
