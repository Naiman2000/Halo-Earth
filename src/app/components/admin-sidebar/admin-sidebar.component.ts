import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './admin-sidebar.component.html',
    styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit {
  constructor(public authService: AuthService) {}
  
  ngOnInit(): void {
    // Ensure user data is loaded
    this.authService.refreshUserData();
  }
}
