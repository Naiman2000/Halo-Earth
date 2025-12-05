import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoralSpecies } from '../../../models/coral-species.model';

@Component({
  selector: 'app-coral-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coral-management.html',
  styleUrl: './coral-management.scss',
})
export class CoralManagement implements OnInit {
  corals: CoralSpecies[] = [];
  filteredCorals: CoralSpecies[] = [];
  searchTerm = '';
  filterStatus = 'all';
  isLoading = true;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  
  currentCoral: CoralSpecies = this.getEmptyCoral();

  conservationStatuses = [
    'Least Concern',
    'Near Threatened',
    'Vulnerable',
    'Endangered',
    'Critically Endangered',
    'Extinct in the Wild',
    'Extinct'
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // For template access
  Math = Math;

  ngOnInit(): void {
    this.loadCorals();
  }

  getEmptyCoral(): CoralSpecies {
    return {
      scientificName: '',
      commonName: '',
      description: '',
      imageUrl: '',
      conservationStatus: 'Least Concern'
    };
  }

  loadCorals(): void {
    setTimeout(() => {
      this.corals = [
        {
          id: '1',
          scientificName: 'Acropora cervicornis',
          commonName: 'Staghorn Coral',
          description: 'Fast-growing coral with cylindrical branches that form dense thickets',
          imageUrl: '',
          conservationStatus: 'Critically Endangered'
        },
        {
          id: '2',
          scientificName: 'Pocillopora damicornis',
          commonName: 'Cauliflower Coral',
          description: 'Hardy coral species with compact, rounded colonies',
          imageUrl: '',
          conservationStatus: 'Least Concern'
        },
        {
          id: '3',
          scientificName: 'Montipora capitata',
          commonName: 'Rice Coral',
          description: 'Reef-building coral with small polyps and encrusting growth form',
          imageUrl: '',
          conservationStatus: 'Near Threatened'
        }
      ];
      
      this.filteredCorals = [...this.corals];
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  filterCorals(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCorals = this.corals.filter(coral => {
      const matchesSearch = coral.scientificName.toLowerCase().includes(term) ||
                           coral.commonName.toLowerCase().includes(term) ||
                           coral.description.toLowerCase().includes(term);
      const matchesStatus = this.filterStatus === 'all' || 
                           coral.conservationStatus === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
    this.updatePagination();
    this.currentPage = 1;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCorals.length / this.itemsPerPage);
  }

  get paginatedCorals(): CoralSpecies[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCorals.slice(start, end);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.currentCoral = this.getEmptyCoral();
    this.showModal = true;
  }

  openEditModal(coral: CoralSpecies): void {
    this.modalMode = 'edit';
    this.currentCoral = { ...coral };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCoral(): void {
    if (this.modalMode === 'add') {
      const newCoral = {
        ...this.currentCoral,
        id: Date.now().toString()
      };
      this.corals.unshift(newCoral);
    } else {
      const index = this.corals.findIndex(c => c.id === this.currentCoral.id);
      if (index !== -1) {
        this.corals[index] = { ...this.currentCoral };
      }
    }
    
    this.filterCorals();
    this.closeModal();
  }

  deleteCoral(coral: CoralSpecies): void {
    if (confirm(`Are you sure you want to delete "${coral.commonName}"?`)) {
      this.corals = this.corals.filter(c => c.id !== coral.id);
      this.filterCorals();
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Least Concern': 'success',
      'Near Threatened': 'info',
      'Vulnerable': 'warning',
      'Endangered': 'danger',
      'Critically Endangered': 'danger',
      'Extinct in the Wild': 'dark',
      'Extinct': 'dark'
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
