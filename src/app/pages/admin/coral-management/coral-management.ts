import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoralSpecies } from '../../../models/coral-species.model';
import { CoralSpeciesService } from '../../../services/coral-species.service';

@Component({
  selector: 'app-coral-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coral-management.html',
  styleUrl: './coral-management.scss',
})
export class CoralManagement implements OnInit {
  private coralService = inject(CoralSpeciesService);

  corals: CoralSpecies[] = [];
  filteredCorals: CoralSpecies[] = [];
  searchTerm = '';
  filterStatus = 'all';
  isLoading = true;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  isSaving = false;

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
      location: '',
      conservationStatus: 'Least Concern'
    };
  }

  loadCorals(): void {
    this.isLoading = true;
    this.coralService.getCoralSpecies().subscribe({
      next: (corals) => {
        this.corals = corals;
        this.filterCorals(); // Initial filter apply
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading corals:', error);
        this.isLoading = false;
      }
    });
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

  async saveCoral(): Promise<void> {
    this.isSaving = true;
    try {
      if (this.modalMode === 'add') {
        const { id, ...data } = this.currentCoral; // Remove ID for add
        await this.coralService.addCoral(data as CoralSpecies);
      } else {
        if (this.currentCoral.id) {
          await this.coralService.updateCoral(this.currentCoral.id, this.currentCoral);
        }
      }
      this.closeModal();
      // Data will auto-update via subscription, but we can verify
    } catch (error) {
      console.error('Error saving coral:', error);
      alert('Failed to save coral species.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCoral(coral: CoralSpecies): Promise<void> {
    if (confirm(`Are you sure you want to delete "${coral.commonName}"?`) && coral.id) {
      try {
        await this.coralService.deleteCoral(coral.id);
      } catch (error) {
        console.error('Error deleting coral:', error);
        alert('Failed to delete coral species.');
      }
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
