import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'admin-layout',
  templateUrl: 'admin-layout.html',
  styleUrls: ['admin-layout.scss'],
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminSidebarComponent]
})
export class AdminLayout {

}
