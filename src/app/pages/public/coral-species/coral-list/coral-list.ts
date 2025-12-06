import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoralSpeciesService } from '../../../../services/coral-species.service';
import { CoralSpecies } from '../../../../models/coral-species.model';
import { DonationService } from '../../../../services/donation.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-coral-list',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './coral-list.html',
  styleUrl: './coral-list.scss',
})
export class CoralList implements OnInit, OnDestroy {
  private coralService = inject(CoralSpeciesService);
  private donationService = inject(DonationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private subscription?: Subscription;

  corals: CoralSpecies[] = [];
  isLoading = true;
  selectedCoral: string | null = null;

  donationForm!: FormGroup;
  isSubmitting = false;
  qrCodeValue: string = '';
  referenceNumber: string = '';

  ngOnInit() {
    this.loadCorals();
    this.initForm();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private initForm() {
    this.donationForm = this.fb.group({
      donorName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      referenceCode: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    // Generate QR code when amount changes
    this.donationForm.get('amount')?.valueChanges.subscribe(amount => {
      this.updateQRCode(amount);
    });
  }

  private loadCorals() {
    this.isLoading = true;
    this.cdr.markForCheck(); // Mark for change detection
    
    this.subscription = this.coralService.getCoralSpecies().subscribe({
      next: (corals) => {
        this.corals = corals || [];
        this.isLoading = false;
        this.cdr.markForCheck(); // Mark for change detection
      },
      error: (error) => {
        console.error('Error loading corals:', error);
        this.isLoading = false;
        // Fallback data
        this.corals = [
          {
            id: '1',
            scientificName: 'Acropora cervicornis',
            commonName: 'Staghorn Coral',
            description: 'Fast-growing branching coral that provides critical habitat for fish and invertebrates.',
            conservationStatus: 'Critically Endangered',
            imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800',
            location: 'Caribbean Sea'
          },
          {
            id: '2',
            scientificName: 'Diploria labyrinthiformis',
            commonName: 'Brain Coral',
            description: 'Long-lived massive coral with distinctive grooved surface resembling a brain.',
            conservationStatus: 'Least Concern',
            imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800',
            location: 'Atlantic Ocean'
          },
          {
            id: '3',
            scientificName: 'Acropora palmata',
            commonName: 'Elkhorn Coral',
            description: 'Critically endangered species with broad, flattened branches like elk antlers.',
            conservationStatus: 'Critically Endangered',
            imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
            location: 'Caribbean Sea'
          },
          {
            id: '4',
            scientificName: 'Acropora hyacinthus',
            commonName: 'Table Coral',
            description: 'Beautiful plate-like coral that forms extensive horizontal structures.',
            conservationStatus: 'Near Threatened',
            imageUrl: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&q=80&w=800',
            location: 'Indo-Pacific'
          },
          {
            id: '5',
            scientificName: 'Dendrogyra cylindrus',
            commonName: 'Pillar Coral',
            description: 'Rare and unique coral with tall, pillar-like columns reaching towards the surface.',
            conservationStatus: 'Vulnerable',
            imageUrl: 'https://images.unsplash.com/photo-1534234058651-73977dc8d123?auto=format&fit=crop&q=80&w=800',
            location: 'Caribbean Sea'
          },
          {
            id: '6',
            scientificName: 'Millepora alcicornis',
            commonName: 'Fire Coral',
            description: 'Vibrant golden-brown coral that plays an important role in reef structure.',
            conservationStatus: 'Least Concern',
            imageUrl: 'https://images.unsplash.com/photo-1620893322421-509cb7b77134?auto=format&fit=crop&q=80&w=800',
            location: 'Tropical Waters'
          }
        ];
        this.cdr.markForCheck(); // Mark for change detection
      },
      complete: () => {
        // Ensure loading is false even if next didn't fire
        if (this.isLoading) {
          this.isLoading = false;
          this.cdr.markForCheck(); // Mark for change detection
        }
      }
    });
  }

  selectCoral(coralId: string) {
    this.selectedCoral = coralId;
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('adoption-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  updateQRCode(amount: number) {
    if (amount && amount >= 1) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      this.referenceNumber = `DON-${timestamp}-${random}`;

      const bankAccount = '1234567890';
      const bankName = 'MyCoral Bank';
      this.qrCodeValue = `Bank Transfer\nAccount: ${bankAccount}\nBank: ${bankName}\nAmount: RM ${amount}\nReference: ${this.referenceNumber}`;
    } else {
      this.qrCodeValue = '';
      this.referenceNumber = '';
    }
  }

  async onSubmit() {
    if (!this.selectedCoral) {
      alert('Please select a coral species first!');
      return;
    }

    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.donationForm.value;
      const selectedCoralObj = this.corals.find(c => c.id === this.selectedCoral);

      const reference = await this.donationService.createDonation({
        amount: formValue.amount,
        donorName: formValue.donorName,
        donorEmail: formValue.email,
        message: `Adopted ${selectedCoralObj?.commonName} (${selectedCoralObj?.scientificName}). Ref: ${formValue.referenceCode}`,
        date: Timestamp.now()
      });

      this.router.navigate(['/donate/thank-you'], {
        queryParams: { ref: reference }
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('There was an error submitting your donation. Please try again.');
      this.isSubmitting = false;
    }
  }

  getSelectedCoralName(): string {
    return this.corals.find(c => c.id === this.selectedCoral)?.commonName || '';
  }
}
