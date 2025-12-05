import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SiteConfig {
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

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site-settings.html',
  styleUrl: './site-settings.scss',
})
export class SiteSettings implements OnInit {
  config: SiteConfig = this.getDefaultConfig();
  isSaving = false;
  saveSuccess = false;
  activeTab: 'general' | 'contact' | 'social' | 'donation' | 'advanced' = 'general';

  ngOnInit(): void {
    this.loadSettings();
  }

  getDefaultConfig(): SiteConfig {
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

  loadSettings(): void {
    // In production, load from Firestore
    setTimeout(() => {
      this.config = this.getDefaultConfig();
    }, 300);
  }

  saveSettings(): void {
    this.isSaving = true;
    
    // In production, save to Firestore
    setTimeout(() => {
      this.isSaving = false;
      this.saveSuccess = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);
    }, 1000);
  }

  switchTab(tab: 'general' | 'contact' | 'social' | 'donation' | 'advanced'): void {
    this.activeTab = tab;
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.config = this.getDefaultConfig();
    }
  }

  get donationProgress(): number {
    return (this.config.currentDonations / this.config.donationGoal) * 100;
  }
}
