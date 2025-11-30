import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-public-footer',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './public-footer.component.html',
    styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent {
    currentYear = new Date().getFullYear();

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
