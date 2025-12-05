import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormSubmission } from '../../../models/form.model';
import { Timestamp } from '@angular/fire/firestore';

interface Message extends FormSubmission {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  replied?: boolean;
}

@Component({
  selector: 'app-message-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-management.html',
  styleUrl: './message-management.scss',
})
export class MessageManagement implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  searchTerm = '';
  filterStatus: 'all' | 'new' | 'read' | 'archived' = 'all';
  filterReplied = 'all';
  isLoading = true;
  showDetailModal = false;
  selectedMessage: Message | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    setTimeout(() => {
      this.messages = [
        {
          id: '1',
          type: 'contact',
          status: 'new',
          name: 'David Wilson',
          email: 'david@example.com',
          subject: 'Partnership Opportunity',
          message: 'We are a marine conservation organization looking to partner with Halo Earth on coral restoration projects.',
          submittedAt: Timestamp.fromDate(new Date('2024-12-05')),
          replied: false,
          data: {}
        },
        {
          id: '2',
          type: 'contact',
          status: 'read',
          name: 'Lisa Anderson',
          email: 'lisa@example.com',
          subject: 'Media Inquiry',
          message: 'I am a journalist writing an article about coral conservation. Would love to interview your team.',
          submittedAt: Timestamp.fromDate(new Date('2024-12-04')),
          replied: true,
          data: {}
        },
        {
          id: '3',
          type: 'contact',
          status: 'new',
          name: 'Robert Martinez',
          email: 'robert@example.com',
          subject: 'Question About Programs',
          message: 'Can you provide more information about your educational programs for schools?',
          submittedAt: Timestamp.fromDate(new Date('2024-12-03')),
          replied: false,
          data: {}
        },
        {
          id: '4',
          type: 'contact',
          status: 'read',
          name: 'Jennifer Lee',
          email: 'jennifer@example.com',
          subject: 'Donation Receipt',
          message: 'I made a donation last week but haven\'t received a receipt. Can you help?',
          submittedAt: Timestamp.fromDate(new Date('2024-12-02')),
          replied: true,
          data: {}
        }
      ];
      
      this.filteredMessages = [...this.messages];
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  filterMessages(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredMessages = this.messages.filter(message => {
      const matchesSearch = 
        (message.name?.toLowerCase().includes(term) || false) ||
        (message.email?.toLowerCase().includes(term) || false) ||
        (message.subject?.toLowerCase().includes(term) || false) ||
        (message.message?.toLowerCase().includes(term) || false);
      
      const matchesStatus = this.filterStatus === 'all' || message.status === this.filterStatus;
      
      const matchesReplied = 
        this.filterReplied === 'all' ||
        (this.filterReplied === 'replied' && message.replied) ||
        (this.filterReplied === 'not-replied' && !message.replied);
      
      return matchesSearch && matchesStatus && matchesReplied;
    });
    
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMessages.length / this.itemsPerPage);
  }

  get paginatedMessages(): Message[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredMessages.slice(start, end);
  }

  viewDetails(message: Message): void {
    this.selectedMessage = message;
    this.showDetailModal = true;
    
    // Mark as read
    if (message.status === 'new') {
      this.updateMessageStatus(message, 'read');
    }
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedMessage = null;
  }

  updateMessageStatus(message: Message, status: 'new' | 'read' | 'archived'): void {
    const index = this.messages.findIndex(m => m.id === message.id);
    if (index !== -1) {
      this.messages[index].status = status;
      this.filterMessages();
    }
  }

  toggleReplied(message: Message): void {
    const index = this.messages.findIndex(m => m.id === message.id);
    if (index !== -1) {
      this.messages[index].replied = !this.messages[index].replied;
      this.filterMessages();
    }
  }

  archiveMessage(message: Message): void {
    this.updateMessageStatus(message, 'archived');
    this.closeDetailModal();
  }

  exportToCSV(): void {
    const headers = ['Date', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Replied'];
    const rows = this.filteredMessages.map(m => [
      this.formatDate(m.submittedAt),
      m.name || '',
      m.email || '',
      m.subject || '',
      m.message || '',
      m.status,
      m.replied ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages_${new Date().toISOString().split('T')[0]}.csv`;
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

  get unreadCount(): number {
    return this.messages.filter(m => m.status === 'new').length;
  }
}
