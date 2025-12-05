import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormSubmission } from '../../../models/form.model';
import { Timestamp } from '@angular/fire/firestore';

interface Lead extends FormSubmission {
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  message?: string;
  contacted?: boolean;
}

@Component({
  selector: 'app-lead-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-management.html',
  styleUrl: './lead-management.scss',
})
export class LeadManagement implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  searchTerm = '';
  filterStatus: 'all' | 'new' | 'read' | 'archived' = 'all';
  filterContacted = 'all';
  isLoading = true;
  showDetailModal = false;
  selectedLead: Lead | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    setTimeout(() => {
      this.leads = [
        {
          id: '1',
          type: 'signup',
          status: 'new',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1 555-0123',
          program: 'Reef Restoration Program',
          message: 'Interested in volunteering this summer',
          submittedAt: Timestamp.fromDate(new Date('2024-12-05')),
          contacted: false,
          data: {}
        },
        {
          id: '2',
          type: 'signup',
          status: 'read',
          name: 'Michael Chen',
          email: 'michael@example.com',
          phone: '+1 555-0124',
          program: 'Marine Research Initiative',
          message: 'Looking for research opportunities',
          submittedAt: Timestamp.fromDate(new Date('2024-12-04')),
          contacted: true,
          data: {}
        },
        {
          id: '3',
          type: 'signup',
          status: 'new',
          name: 'Emily Davis',
          email: 'emily@example.com',
          phone: '+1 555-0125',
          program: 'Educational Outreach',
          message: 'Want to help with school programs',
          submittedAt: Timestamp.fromDate(new Date('2024-12-03')),
          contacted: false,
          data: {}
        }
      ];
      
      this.filteredLeads = [...this.leads];
      this.updatePagination();
      this.isLoading = false;
    }, 500);
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

  updateLeadStatus(lead: Lead, status: 'new' | 'read' | 'archived'): void {
    const index = this.leads.findIndex(l => l.id === lead.id);
    if (index !== -1) {
      this.leads[index].status = status;
      this.filterLeads();
    }
  }

  toggleContacted(lead: Lead): void {
    const index = this.leads.findIndex(l => l.id === lead.id);
    if (index !== -1) {
      this.leads[index].contacted = !this.leads[index].contacted;
      this.filterLeads();
    }
  }

  archiveLead(lead: Lead): void {
    this.updateLeadStatus(lead, 'archived');
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

  formatDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new': 'danger',
      'read': 'warning',
      'archived': 'secondary'
    };
    return statusMap[status] || 'secondary';
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
