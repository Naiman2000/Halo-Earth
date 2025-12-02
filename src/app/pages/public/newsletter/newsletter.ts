import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.scss',
})
export class Newsletter implements AfterViewInit {
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);
  
  newsletterForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  availableInterests = [
    'Conservation Updates',
    'Marine Research',
    'Volunteer Opportunities',
    'Event Notifications'
  ];

  constructor() {
    this.newsletterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      interests: [[]] // Array of selected interests
    });
  }

  ngAfterViewInit() {
    // Scroll to subscription form after view initialization
    setTimeout(() => {
      const subscribeForm = document.getElementById('subscribe-form');
      if (subscribeForm) {
        subscribeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  toggleInterest(interest: string) {
    const interests = this.newsletterForm.get('interests')?.value || [];
    const index = interests.indexOf(interest);
    
    if (index > -1) {
      interests.splice(index, 1);
    } else {
      interests.push(interest);
    }
    
    this.newsletterForm.patchValue({ interests });
  }

  isInterestSelected(interest: string): boolean {
    const interests = this.newsletterForm.get('interests')?.value || [];
    return interests.includes(interest);
  }

  async onSubmit() {
    if (this.newsletterForm.invalid) {
      this.markFormGroupTouched(this.newsletterForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const formData = {
        firstName: this.newsletterForm.value.firstName,
        email: this.newsletterForm.value.email,
        interests: this.newsletterForm.value.interests || [],
        subscribedAt: new Date(),
        active: true
      };

      await this.firestoreService.addDoc('newsletter-subscriptions', formData);
      
      this.isSuccess = true;
      this.newsletterForm.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.isSuccess = false;
      }, 5000);
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      this.errorMessage = 'Something went wrong. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

