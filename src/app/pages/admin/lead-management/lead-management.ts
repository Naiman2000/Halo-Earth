import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { LeadService, Lead } from '../../../services/lead.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lead-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-management.html',
  styleUrl: './lead-management.scss',
})
export class LeadManagement implements OnInit, OnDestroy {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  searchTerm = '';
  filterStatus: 'all' | 'new' | 'read' | 'archived' = 'all';
  filterContacted = 'all';
  isLoading = true;
  showDetailModal = false;
  selectedLead: Lead | null = null;
  private subscription?: Subscription;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  constructor(private leadService: LeadService) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadLeads(): void {
    this.isLoading = true;
    this.subscription = this.leadService.getLeads().subscribe({
      next: (leads) => {
        this.leads = leads;
        this.filteredLeads = [...this.leads];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leads:', error);
        this.isLoading = false;
      }
    });
  }

  filterLeads(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredLeads = this.leads.filter(lead => {
      const matchesSearch = 
        (lead.name?.toLowerCase().includes(term) || false) ||
        (lead.email?.toLowerCase().includes(term) || false) ||
        (lead.program?.toLowerCase().includes(term) || false);
      
      const matchesStatus = this.filterStatus === 'all' || lead.status === this.filterStatus;
      
      const matchesContacted = 
        this.filterContacted === 'all' ||
        (this.filterContacted === 'contacted' && lead.contacted) ||
        (this.filterContacted === 'not-contacted' && !lead.contacted);
      
      return matchesSearch && matchesStatus && matchesContacted;
    });
    
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLeads.length / this.itemsPerPage);
  }

  get paginatedLeads(): Lead[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLeads.slice(start, end);
  }

  viewDetails(lead: Lead): void {
    this.selectedLead = lead;
    this.showDetailModal = true;
    
    // Mark as read
    if (lead.status === 'new') {
      this.updateLeadStatus(lead, 'read');
    }
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedLead = null;
  }

  async updateLeadStatus(lead: Lead, status: 'new' | 'read' | 'archived'): Promise<void> {
    if (!lead.id) {
      alert('Cannot update status: Missing ID');
      return;
    }

    try {
      await this.leadService.updateLeadStatus(lead.id, status);
      // The subscription will automatically update the list
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status. Please try again.');
    }
  }

  async toggleContacted(lead: Lead): Promise<void> {
    if (!lead.id) {
      alert('Cannot update contacted status: Missing ID');
      return;
    }

    try {
      const newContactedStatus = !lead.contacted;
      await this.leadService.updateLeadContacted(lead.id, newContactedStatus);
      // The subscription will automatically update the list
    } catch (error) {
      console.error('Error updating contacted status:', error);
      alert('Failed to update contacted status. Please try again.');
    }
  }

  async archiveLead(lead: Lead): Promise<void> {
    await this.updateLeadStatus(lead, 'archived');
    this.closeDetailModal();
  }

  exportToCSV(): void {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Program', 'Message', 'Status', 'Contacted'];
    const rows = this.filteredLeads.map(l => [
      this.formatDate(l.submittedAt),
      l.name || '',
      l.email || '',
      l.phone || '',
      l.program || '',
      l.message || '',
      l.status,
      l.contacted ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(timestamp: Timestamp | Date | undefined): string {
    if (!timestamp) {
      return '—';
    }
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getStatusBadgeClass(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      'new': 'danger',
      'read': 'warning',
      'archived': 'secondary'
    };
    return status ? statusMap[status] || 'secondary' : 'secondary';
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
