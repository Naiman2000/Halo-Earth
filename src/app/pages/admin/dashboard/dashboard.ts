import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  totalPartners: number;
  totalCorals: number;
  totalLeads: number;
  totalMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'donation' | 'lead' | 'message';
  title: string;
  description: string;
  time: Date;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats: DashboardStats = {
    totalDonations: 0,
    totalAmount: 0,
    totalPartners: 0,
    totalCorals: 0,
    totalLeads: 0,
    totalMessages: 0
  };

  recentActivities: RecentActivity[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Simulate loading data - In production, this would fetch from Firebase
    setTimeout(() => {
      this.stats = {
        totalDonations: 142,
        totalAmount: 45280,
        totalPartners: 12,
        totalCorals: 38,
        totalLeads: 56,
        totalMessages: 23
      };

      this.recentActivities = [
        {
          id: '1',
          type: 'donation',
          title: 'New Donation Received',
          description: 'John Doe donated $250',
          time: new Date(Date.now() - 1000 * 60 * 15),
          status: 'success'
        },
        {
          id: '2',
          type: 'lead',
          title: 'New Program Interest',
          description: 'Jane Smith expressed interest in Reef Restoration',
          time: new Date(Date.now() - 1000 * 60 * 45),
          status: 'info'
        },
        {
          id: '3',
          type: 'message',
          title: 'New Contact Message',
          description: 'Mike Johnson sent a partnership inquiry',
          time: new Date(Date.now() - 1000 * 60 * 120),
          status: 'warning'
        }
      ];

      this.isLoading = false;
    }, 800);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'donation': return 'bi-cash-coin';
      case 'lead': return 'bi-person-lines-fill';
      case 'message': return 'bi-envelope';
      default: return 'bi-bell';
    }
  }
}
