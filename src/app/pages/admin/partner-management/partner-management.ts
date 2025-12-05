import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerProgram } from '../../../models/partner-program.model';

@Component({
  selector: 'app-partner-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-management.html',
  styleUrl: './partner-management.scss',
})
export class PartnerManagement implements OnInit {
  partners: PartnerProgram[] = [];
  filteredPartners: PartnerProgram[] = [];
  searchTerm = '';
  isLoading = true;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  
  currentPartner: PartnerProgram = {
    name: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
    isActive: true
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    // Simulate loading data - In production, this would fetch from Firebase
    setTimeout(() => {
      this.partners = [
        {
          id: '1',
          name: 'Ocean Conservation Society',
          description: 'Leading coral reef restoration program in the Pacific',
          websiteUrl: 'https://oceansociety.org',
          logoUrl: '',
          isActive: true
        },
        {
          id: '2',
          name: 'Coral Restoration Foundation',
          description: 'Largest coral restoration organization in the world',
          websiteUrl: 'https://coralrestoration.org',
          logoUrl: '',
          isActive: true
        },
        {
          id: '3',
          name: 'Marine Conservation Institute',
          description: 'Protecting ocean life and ecosystems through science',
          websiteUrl: 'https://marine-conservation.org',
          logoUrl: '',
          isActive: false
        }
      ];
      
      this.filteredPartners = [...this.partners];
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  filterPartners(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPartners = this.partners.filter(partner =>
      partner.name.toLowerCase().includes(term) ||
      partner.description.toLowerCase().includes(term)
    );
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPartners.length / this.itemsPerPage);
  }

  get paginatedPartners(): PartnerProgram[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPartners.slice(start, end);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.currentPartner = {
      name: '',
      description: '',
      websiteUrl: '',
      logoUrl: '',
      isActive: true
    };
    this.showModal = true;
  }

  openEditModal(partner: PartnerProgram): void {
    this.modalMode = 'edit';
    this.currentPartner = { ...partner };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePartner(): void {
    if (this.modalMode === 'add') {
      // Add new partner
      const newPartner = {
        ...this.currentPartner,
        id: Date.now().toString()
      };
      this.partners.unshift(newPartner);
    } else {
      // Update existing partner
      const index = this.partners.findIndex(p => p.id === this.currentPartner.id);
      if (index !== -1) {
        this.partners[index] = { ...this.currentPartner };
      }
    }
    
    this.filterPartners();
    this.closeModal();
  }

  deletePartner(partner: PartnerProgram): void {
    if (confirm(`Are you sure you want to delete "${partner.name}"?`)) {
      this.partners = this.partners.filter(p => p.id !== partner.id);
      this.filterPartners();
    }
  }

  toggleStatus(partner: PartnerProgram): void {
    const index = this.partners.findIndex(p => p.id === partner.id);
    if (index !== -1) {
      this.partners[index].isActive = !this.partners[index].isActive;
      this.filterPartners();
    }
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
