import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-header.component.html',
    styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
    // Placeholder for user name, in real app this would come from auth service
    userName = 'Admin User';

    logout() {
        // Placeholder for logout logic
        console.log('Logout clicked');
    }
}
