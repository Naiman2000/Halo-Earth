import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
    selector: 'app-signout',
    standalone: true,
    template: '<p>Signing out...</p>',
    styles: []
})
export class Signout implements OnInit {
    private auth = inject(Auth);
    private router = inject(Router);

    async ngOnInit() {
        try {
            await signOut(this.auth);
            // Redirect to home page after successful logout
            this.router.navigate(['/']);
        } catch (error) {
            console.error('Logout failed', error);
            // Redirect to home page even if logout fails
            this.router.navigate(['/']);
        }
    }
}
