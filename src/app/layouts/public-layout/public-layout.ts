import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { PublicFooterComponent } from '../../components/public-footer/public-footer.component';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'public-layout',
  templateUrl: 'public-layout.html',
  styleUrls: ['public-layout.scss'],
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent, CommonModule]
})
export class PublicLayout implements OnInit, OnDestroy {
  showFooter = true;
  private subscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.updateFooterVisibility(this.router.url);

    // Listen to route changes
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateFooterVisibility(event.url);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateFooterVisibility(url: string) {
    // Hide footer on landing page (root route)
    this.showFooter = url !== '/' && !url.startsWith('/?');
  }
}
