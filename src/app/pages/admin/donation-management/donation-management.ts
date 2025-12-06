import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Donation, PaymentStatus } from '../../../models/donation.model';
import { Timestamp } from '@angular/fire/firestore';
import { DonationService } from '../../../services/donation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-donation-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-management.html',
  styleUrl: './donation-management.scss',
})
export class DonationManagement implements OnInit, OnDestroy {
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  searchTerm = '';
  filterDate = 'all';
  filterStatus: PaymentStatus | 'all' = 'all';
  editingStatus: { [key: string]: PaymentStatus } = {};
  isLoading = true;
  showDetailModal = false;
  selectedDonation: Donation | null = null;
  private subscription?: Subscription;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  // Stats
  totalAmount = 0;
  averageAmount = 0;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadDonations(): void {
    this.isLoading = true;
    this.subscription = this.donationService.getDonations().subscribe({
      next: (donations) => {
        this.donations = donations;
        this.filteredDonations = [...this.donations];
        this.calculateStats();
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donations:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    // Only count verified donations in stats
    const verifiedDonations = this.filteredDonations.filter(d => d.status === 'verified');
    this.totalAmount = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);
    this.averageAmount = verifiedDonations.length > 0 
      ? this.totalAmount / verifiedDonations.length 
      : 0;
  }

  filterDonations(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDonations = this.donations.filter(donation => {
      const matchesSearch = 
        (donation.donorName?.toLowerCase().includes(term) || false) ||
        (donation.donorEmail?.toLowerCase().includes(term) || false) ||
        donation.amount.toString().includes(term) ||
        (donation.reference?.toLowerCase().includes(term) || false);
      
      const matchesStatus = this.filterStatus === 'all' || donation.status === this.filterStatus;
      
      // Date filtering would be implemented here
      return matchesSearch && matchesStatus;
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
    const headers = ['Date', 'Donor Name', 'Email', 'Amount', 'Reference', 'Status', 'Program ID', 'Message'];
    const rows = this.filteredDonations.map(d => [
      this.formatDate(d.date),
      d.donorName || '',
      d.donorEmail || '',
      d.amount.toString(),
      d.reference || '',
      this.getStatusText(d.status),
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
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
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

  getStatusBadgeClass(status?: PaymentStatus): string {
    switch(status) {
      case 'verified':
        return 'bg-success';
      case 'unverified':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status?: PaymentStatus): string {
    switch(status) {
      case 'verified':
        return 'Verified';
      case 'unverified':
        return 'Unverified';
      default:
        return 'Unverified';
    }
  }

  startEditingStatus(donation: Donation): void {
    if (donation.id) {
      this.editingStatus[donation.id] = donation.status || 'unverified';
    }
  }

  cancelEditingStatus(donation: Donation): void {
    if (donation.id) {
      delete this.editingStatus[donation.id];
    }
  }

  isEditingStatus(donation: Donation): boolean {
    return donation.id ? donation.id in this.editingStatus : false;
  }

  async saveStatus(donation: Donation): Promise<void> {
    if (!donation.id) {
      alert('Cannot update status: Missing ID');
      return;
    }

    const newStatus = this.editingStatus[donation.id];
    if (!newStatus) {
      return;
    }

    try {
      await this.donationService.updateDonationStatus(donation.id, newStatus);
      delete this.editingStatus[donation.id];
      // The subscription will automatically update the list
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Failed to update donation status. Please try again.');
    }
  }

  async deleteDonation(donation: Donation): Promise<void> {
    if (!donation.id) {
      alert('Cannot delete donation: Missing ID');
      return;
    }

    const confirmMessage = `Are you sure you want to delete this donation?\n\n` +
      `Donor: ${donation.donorName || 'Anonymous'}\n` +
      `Amount: ${this.formatCurrency(donation.amount)}\n` +
      `Reference: ${donation.reference || 'N/A'}\n\n` +
      `This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      try {
        await this.donationService.deleteDonation(donation.id);
        // The subscription will automatically update the list
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert('Failed to delete donation. Please try again.');
      }
    }
  }

  async updateStatus(donation: Donation, status: PaymentStatus): Promise<void> {
    if (!donation.id) {
      alert('Cannot update status: Missing ID');
      return;
    }

    try {
      await this.donationService.updateDonationStatus(donation.id, status);
      // The subscription will automatically update the list
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Failed to update donation status. Please try again.');
    }
  }

  getStatusOptions(): PaymentStatus[] {
    return ['unverified', 'verified'];
  }
}
