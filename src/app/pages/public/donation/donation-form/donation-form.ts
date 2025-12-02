import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { DonationService } from '../../../../services/donation.service';
import { Donation } from '../../../../models/donation.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-donation-form',
  imports: [CommonModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './donation-form.html',
  styleUrl: './donation-form.scss',
})
export class DonationForm implements OnInit {
  donationForm!: FormGroup;
  presetAmounts = [50, 100, 250, 500];
  selectedAmount: number | null = null;
  qrCodeValue: string = '';
  referenceNumber: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.donationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(10)]],
      donorName: ['', [Validators.required, Validators.minLength(2)]],
      donorEmail: ['', [Validators.required, Validators.email]],
      message: ['']
    });

    // Watch for amount changes to update QR code
    this.donationForm.get('amount')?.valueChanges.subscribe(() => {
      this.updateQRCode();
    });
  }

  selectPresetAmount(amount: number) {
    this.selectedAmount = amount;
    this.donationForm.patchValue({ amount: amount });
    this.updateQRCode();
  }

  onCustomAmountChange() {
    const amount = this.donationForm.get('amount')?.value;
    if (amount && !this.presetAmounts.includes(amount)) {
      this.selectedAmount = null;
    }
    this.updateQRCode();
  }

  updateQRCode() {
    const amount = this.donationForm.get('amount')?.value;
    if (amount && amount >= 10) {
      // Generate reference number for QR code
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      this.referenceNumber = `DON-${timestamp}-${random}`;

      // Bank account details (should be in environment or config)
      const bankAccount = '1234567890'; // Placeholder - should be in environment
      const bankName = 'MyCoral Bank'; // Placeholder
      
      // Format QR code data for bank transfer
      // Format: Bank transfer details with reference
      this.qrCodeValue = `Bank Transfer\nAccount: ${bankAccount}\nBank: ${bankName}\nAmount: RM ${amount}\nReference: ${this.referenceNumber}`;
    } else {
      this.qrCodeValue = '';
      this.referenceNumber = '';
    }
  }

  async onSubmit() {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.donationForm.value;
      
      // Generate final reference number
      const reference = await this.donationService.createDonation({
        amount: formValue.amount,
        donorName: formValue.donorName,
        donorEmail: formValue.donorEmail,
        message: formValue.message || undefined,
        date: Timestamp.now()
      });

      // Navigate to thank you page with reference
      this.router.navigate(['/donate/thank-you'], {
        queryParams: { ref: reference }
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('There was an error submitting your donation. Please try again.');
      this.isSubmitting = false;
    }
  }

  get amountControl() {
    return this.donationForm.get('amount');
  }

  get donorNameControl() {
    return this.donationForm.get('donorName');
  }

  get donorEmailControl() {
    return this.donationForm.get('donorEmail');
  }
}
