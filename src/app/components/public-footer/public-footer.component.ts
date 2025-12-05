import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SiteSettingsService } from '../../services/site-settings.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-public-footer',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './public-footer.component.html',
    styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent implements OnInit, OnDestroy {
    private settingsService = inject(SiteSettingsService);
    private subscription?: Subscription;

    currentYear = new Date().getFullYear();
    
    // Settings from admin (auto-updates when admin changes them!)
    siteName = 'Halo Earth';
    description = 'Dedicated to the preservation and restoration of our planet\'s coral reefs for future generations.';
    facebookUrl = '';
    twitterUrl = '';
    instagramUrl = '';
    linkedinUrl = '';
    contactEmail = '';
    contactPhone = '';
    address = '';

    ngOnInit() {
        // Subscribe to settings - this will automatically update when admin changes them!
        this.subscription = this.settingsService.settings$.subscribe(settings => {
            if (settings) {
                this.siteName = settings.siteName;
                this.description = settings.description;
                this.facebookUrl = settings.facebookUrl;
                this.twitterUrl = settings.twitterUrl;
                this.instagramUrl = settings.instagramUrl;
                this.linkedinUrl = settings.linkedinUrl;
                this.contactEmail = settings.contactEmail;
                this.contactPhone = settings.contactPhone;
                this.address = settings.address;
            }
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    onNewsletterSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        
        if (emailInput && emailInput.value) {
            // Redirect to newsletter page with email pre-filled or handle submission
            window.location.href = `/newsletter?email=${encodeURIComponent(emailInput.value)}`;
        } else {
            window.location.href = '/newsletter';
        }
    }
}
