import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoralSpeciesService } from '../../../../services/coral-species.service';
import { CoralSpecies } from '../../../../models/coral-species.model';

@Component({
  selector: 'app-coral-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './coral-list.html',
  styleUrl: './coral-list.scss',
})
export class CoralList implements OnInit, OnDestroy {
  private coralService = inject(CoralSpeciesService);
  private subscription?: Subscription;

  corals: CoralSpecies[] = [];
  filteredCorals: CoralSpecies[] = [];
  isLoading = true;
  searchQuery: string = '';
  selectedStatus: string = 'all';

  conservationStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'Least Concern', label: 'Least Concern' },
    { value: 'Near Threatened', label: 'Near Threatened' },
    { value: 'Vulnerable', label: 'Vulnerable' },
    { value: 'Endangered', label: 'Endangered' },
    { value: 'Critically Endangered', label: 'Critically Endangered' }
  ];

  ngOnInit() {
    this.loadCorals();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadCorals() {
    this.isLoading = true;
    this.subscription = this.coralService.getCoralSpecies().subscribe({
      next: (corals) => {
        this.corals = corals;
        this.filteredCorals = corals;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading corals:', error);
        this.isLoading = false;
        // Use sample data for development
        this.corals = [
          {
            id: '1',
            scientificName: 'Acropora millepora',
            commonName: 'Staghorn Coral',
            description: 'A branching coral species known for its rapid growth and important role in reef building.',
            conservationStatus: 'Vulnerable',
            imageUrl: '/assets/examplepic1.png'
          },
          {
            id: '2',
            scientificName: 'Porites lobata',
            commonName: 'Lobe Coral',
            description: 'A massive coral species that forms large boulder-like structures on reefs.',
            conservationStatus: 'Least Concern',
            imageUrl: '/assets/examplepic1.png'
          },
          {
            id: '3',
            scientificName: 'Montipora capricornis',
            commonName: 'Vase Coral',
            description: 'A plating coral species with distinctive vase-like growth patterns.',
            conservationStatus: 'Near Threatened',
            imageUrl: '/assets/examplepic1.png'
          }
        ];
        this.filteredCorals = this.corals;
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredCorals = this.corals.filter(coral => {
      const matchesSearch = !this.searchQuery || 
        coral.commonName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        coral.scientificName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        coral.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || 
        coral.conservationStatus === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Least Concern': 'status-least-concern',
      'Near Threatened': 'status-near-threatened',
      'Vulnerable': 'status-vulnerable',
      'Endangered': 'status-endangered',
      'Critically Endangered': 'status-critically-endangered'
    };
    return statusMap[status] || 'status-default';
  }
}
