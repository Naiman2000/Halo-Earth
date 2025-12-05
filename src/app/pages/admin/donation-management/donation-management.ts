import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Donation } from '../../../models/donation.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-donation-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-management.html',
  styleUrl: './donation-management.scss',
})
export class DonationManagement implements OnInit {
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  searchTerm = '';
  filterDate = 'all';
  isLoading = true;
  showDetailModal = false;
  selectedDonation: Donation | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  // Stats
  totalAmount = 0;
  averageAmount = 0;

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    setTimeout(() => {
      this.donations = [
        {
          id: '1',
          amount: 250,
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          message: 'Happy to support coral conservation!',
          date: Timestamp.fromDate(new Date('2024-12-05')),
          programId: 'program-1'
        },
        {
          id: '2',
          amount: 500,
          donorName: 'Jane Smith',
          donorEmail: 'jane@example.com',
          message: 'Keep up the great work',
          date: Timestamp.fromDate(new Date('2024-12-04')),
        },
        {
          id: '3',
          amount: 100,
          donorName: 'Bob Johnson',
          donorEmail: 'bob@example.com',
          message: '',
          date: Timestamp.fromDate(new Date('2024-12-03')),
          programId: 'program-2'
        },
        {
          id: '4',
          amount: 1000,
          donorName: 'Alice Williams',
          donorEmail: 'alice@example.com',
          message: 'In memory of my mother who loved the ocean',
          date: Timestamp.fromDate(new Date('2024-12-02')),
        },
        {
          id: '5',
          amount: 75,
          donorName: 'Charlie Brown',
          donorEmail: 'charlie@example.com',
          message: '',
          date: Timestamp.fromDate(new Date('2024-12-01')),
        }
      ];
      
      this.filteredDonations = [...this.donations];
      this.calculateStats();
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  calculateStats(): void {
    this.totalAmount = this.filteredDonations.reduce((sum, d) => sum + d.amount, 0);
    this.averageAmount = this.filteredDonations.length > 0 
      ? this.totalAmount / this.filteredDonations.length 
      : 0;
  }

  filterDonations(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDonations = this.donations.filter(donation => {
      const matchesSearch = 
        (donation.donorName?.toLowerCase().includes(term) || false) ||
        (donation.donorEmail?.toLowerCase().includes(term) || false) ||
        donation.amount.toString().includes(term);
      
      // Date filtering would be implemented here
      return matchesSearch;
    });
    
    this.calculateStats();
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDonations.length / this.itemsPerPage);
  }

  get paginatedDonations(): Donation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDonations.slice(start, end);
  }

  viewDetails(donation: Donation): void {
    this.selectedDonation = donation;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedDonation = null;
  }

  exportToCSV(): void {
    // Prepare CSV content
    const headers = ['Date', 'Donor Name', 'Email', 'Amount', 'Program ID', 'Message'];
    const rows = this.filteredDonations.map(d => [
      this.formatDate(d.date),
      d.donorName || '',
      d.donorEmail || '',
      d.amount.toString(),
      d.programId || '',
      d.message || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
