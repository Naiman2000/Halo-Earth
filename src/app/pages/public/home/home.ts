import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConservationSitesService, ConservationSite } from '../../../services/conservation-sites.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  private sitesService = inject(ConservationSitesService);
  private subscription?: Subscription;
  private map?: L.Map;
  
  sites: ConservationSite[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadSites();
  }

  ngAfterViewInit() {
    // Initialize map after view is ready
    setTimeout(() => {
      const mapElement = document.getElementById('conservation-map');
      if (mapElement) {
        this.initMap();
      }
    }, 100);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

  private loadSites() {
    this.isLoading = true;
    this.subscription = this.sitesService.getSites().subscribe({
      next: (sites) => {
        this.sites = sites;
        this.isLoading = false;
        if (this.map) {
          this.addMarkersToMap();
        }
      },
      error: (error) => {
        console.error('Error loading conservation sites:', error);
        this.isLoading = false;
        // Use sample data for development
        this.sites = [
          {
            id: '1',
            name: 'Great Barrier Reef Station',
            location: { lat: -16.2864, lng: 145.6848 },
            status: 'active',
            description: 'Main conservation station in Australia'
          },
          {
            id: '2',
            name: 'Caribbean Coral Station',
            location: { lat: 18.2208, lng: -66.5901 },
            status: 'expanding',
            description: 'Expanding station in the Caribbean'
          }
        ];
        if (this.map) {
          this.addMarkersToMap();
        }
      }
    });
  }

  private initMap() {
    const mapElement = document.getElementById('conservation-map');
    if (!mapElement) {
      console.warn('Map container not found');
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    // Create map centered on Pulau Bidong, Terengganu
    this.map = L.map('conservation-map', {
      center: [5.6217, 103.0544], // Pulau Bidong, Terengganu
      zoom: 13, // Zoom level 13 for showing the island
      zoomControl: true,
      attributionControl: true
    });
    
    // Add marker for Pulau Bidong
    const pulauBidongMarker = L.marker([5.6217, 103.0544]).addTo(this.map);
    pulauBidongMarker.bindPopup(`
      <div style="padding: 0.5rem;">
        <h5 style="margin: 0 0 0.5rem 0; font-weight: 600;">Pulau Bidong, Terengganu</h5>
        <p style="margin: 0; font-size: 0.875rem; color: #666;">5.6217°N, 103.0544°E</p>
        <span style="display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #0891B2; color: white; border-radius: 4px; font-size: 0.75rem;">
          Active Station
        </span>
      </div>
    `);

    // Add tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Style the map container and add markers if sites are already loaded
    setTimeout(() => {
      this.map?.invalidateSize();
      if (this.sites.length > 0) {
        this.addMarkersToMap();
      }
    }, 200);
  }

  private addMarkersToMap() {
    if (!this.map) return;

    // Clear existing markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map?.removeLayer(layer);
      }
    });

    // Add markers for each site
    this.sites.forEach(site => {
      const iconColor = site.status === 'active' ? '#5BC0DE' : '#FFC107';
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin" style="background-color: ${iconColor}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([site.location.lat, site.location.lng], {
        icon: customIcon
      }).addTo(this.map!);

      // Add popup with site information
      marker.bindPopup(`
        <div style="padding: 0.5rem;">
          <h5 style="margin: 0 0 0.5rem 0; font-weight: 600;">${site.name}</h5>
          <p style="margin: 0; font-size: 0.875rem; color: #666;">${site.description || 'Conservation station'}</p>
          <span style="display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: ${iconColor}; color: white; border-radius: 4px; font-size: 0.75rem;">
            ${site.status === 'active' ? 'Active Station' : 'Expanding Station'}
          </span>
        </div>
      `);
    });

    // Fit map to show all markers
    if (this.sites.length > 0) {
      const bounds = L.latLngBounds(this.sites.map(s => [s.location.lat, s.location.lng]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
