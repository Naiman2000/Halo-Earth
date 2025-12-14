import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  private siteSettingsService = inject(SiteSettingsService);
  settings$ = this.siteSettingsService.getSettings();
}

