import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteSettingsService, SiteSettings as SiteConfig } from '../../../services/site-settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site-settings.html',
  styleUrl: './site-settings.scss',
})
export class SiteSettings implements OnInit, OnDestroy {
  private settingsService = inject(SiteSettingsService);
  private subscription?: Subscription;

  config: SiteConfig = this.settingsService.getCurrentSettings();
  isSaving = false;
  saveSuccess = false;
  saveError = false;
  errorMessage = '';
  activeTab: 'general' | 'contact' | 'social' | 'donation' | 'advanced' = 'general';

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadSettings(): void {
    // Subscribe to settings updates (real-time)
    this.subscription = this.settingsService.settings$.subscribe({
      next: (settings) => {
        if (settings) {
          this.config = { ...settings };
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.errorMessage = 'Failed to load settings';
      }
    });
  }

  async saveSettings(): Promise<void> {
    this.isSaving = true;
    this.saveError = false;
    this.saveSuccess = false;
    
    try {
      // Save to Firestore (this will update ALL public pages automatically!)
      await this.settingsService.saveSettings(this.config);
      
      this.isSaving = false;
      this.saveSuccess = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);
    } catch (error: any) {
      this.isSaving = false;
      this.saveError = true;
      this.errorMessage = error.message || 'Failed to save settings';
      console.error('Error saving settings:', error);
    }
  }

  switchTab(tab: 'general' | 'contact' | 'social' | 'donation' | 'advanced'): void {
    this.activeTab = tab;
  }

  async resetToDefaults(): Promise<void> {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.isSaving = true;
      try {
        await this.settingsService.resetToDefaults();
        this.isSaving = false;
        this.saveSuccess = true;
        
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } catch (error: any) {
        this.isSaving = false;
        this.saveError = true;
        this.errorMessage = error.message || 'Failed to reset settings';
      }
    }
  }

  get donationProgress(): number {
    return (this.config.currentDonations / this.config.donationGoal) * 100;
  }
}
