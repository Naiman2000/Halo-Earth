import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { Subscription } from 'rxjs';
import { CoralSpeciesService } from '../../../../services/coral-species.service';
import { DonationService } from '../../../../services/donation.service';
import { CoralSpecies } from '../../../../models/coral-species.model';
import { Donation } from '../../../../models/donation.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-coral-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, QRCodeComponent],
  templateUrl: './coral-detail.html',
  styleUrl: './coral-detail.scss',
})
export class CoralDetail implements OnInit, OnDestroy {
  private coralService = inject(CoralSpeciesService);
  private donationService = inject(DonationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription?: Subscription;

  coral: CoralSpecies | null = null;
  isLoading = true;
  adoptionForm!: FormGroup;
  presetAmounts = [50, 100, 250, 500];
  selectedAmount: number | null = null;
  qrCodeValue: string = '';
  referenceNumber: string = '';
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const coralId = this.route.snapshot.paramMap.get('id');
    if (coralId) {
      this.loadCoral(coralId);
    }

    this.adoptionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(10)]],
      adopterName: ['', [Validators.required, Validators.minLength(2)]],
      adopterEmail: ['', [Validators.required, Validators.email]],
      dedicationMessage: ['']
    });

    // Watch for amount changes to update QR code
    this.adoptionForm.get('amount')?.valueChanges.subscribe(() => {
      this.updateQRCode();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadCoral(id: string) {
    this.isLoading = true;
    this.subscription = this.coralService.getCoralById(id).subscribe({
      next: (coral) => {
        this.coral = coral;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading coral:', error);
        this.isLoading = false;
        // Use sample data for development
        this.coral = {
          id: id,
          scientificName: 'Acropora millepora',
          commonName: 'Staghorn Coral',
          description: 'A branching coral species known for its rapid growth and important role in reef building. This species forms dense thickets that provide habitat for many marine organisms. Staghorn corals are particularly important for reef structure and are commonly found in shallow reef environments.',
          conservationStatus: 'Vulnerable',
          imageUrl: '/assets/examplepic1.png'
        };
      }
    });
  }

  selectPresetAmount(amount: number) {
    this.selectedAmount = amount;
    this.adoptionForm.patchValue({ amount: amount });
    this.updateQRCode();
  }

  onCustomAmountChange() {
    const amount = this.adoptionForm.get('amount')?.value;
    if (amount && !this.presetAmounts.includes(amount)) {
      this.selectedAmount = null;
    }
    this.updateQRCode();
  }

  updateQRCode() {
    const amount = this.adoptionForm.get('amount')?.value;
    if (amount && amount >= 10) {
      // Generate reference number for QR code
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      this.referenceNumber = `ADOPT-${timestamp}-${random}`;

      // Bank account details (should be in environment or config)
      const bankAccount = '1234567890'; // Placeholder - should be in environment
      const bankName = 'MyCoral Bank'; // Placeholder
      
      // Format QR code data for bank transfer
      this.qrCodeValue = `Bank Transfer\nAccount: ${bankAccount}\nBank: ${bankName}\nAmount: RM ${amount}\nReference: ${this.referenceNumber}\nCoral: ${this.coral?.commonName || 'Coral Adoption'}`;
    } else {
      this.qrCodeValue = '';
      this.referenceNumber = '';
    }
  }

  async onSubmit() {
    if (this.adoptionForm.invalid || !this.coral) {
      this.adoptionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.adoptionForm.value;
      
      // Create donation with coral reference
      const reference = await this.donationService.createDonation({
        amount: formValue.amount,
        donorName: formValue.adopterName,
        donorEmail: formValue.adopterEmail,
        message: formValue.dedicationMessage 
          ? `Coral Adoption: ${this.coral.commonName}\n${formValue.dedicationMessage}`
          : `Coral Adoption: ${this.coral.commonName}`,
        date: Timestamp.now(),
        programId: this.coral.id // Using programId to link to coral
      });

      // Navigate to thank you page with reference
      this.router.navigate(['/donate/thank-you'], {
        queryParams: { ref: reference, type: 'adoption', coral: this.coral.commonName }
      });
    } catch (error) {
      console.error('Error submitting adoption:', error);
      alert('There was an error submitting your adoption. Please try again.');
      this.isSubmitting = false;
    }
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

  get amountControl() {
    return this.adoptionForm.get('amount');
  }

  get adopterNameControl() {
    return this.adoptionForm.get('adopterName');
  }

  get adopterEmailControl() {
    return this.adoptionForm.get('adopterEmail');
  }
}
