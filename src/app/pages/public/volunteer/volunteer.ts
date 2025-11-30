import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-volunteer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.scss',
})
export class Volunteer {
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);
  
  volunteerForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  constructor() {
    this.volunteerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      interests: ['']
    });
  }

  async onSubmit() {
    if (this.volunteerForm.invalid) {
      this.markFormGroupTouched(this.volunteerForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const formData = {
        fullName: this.volunteerForm.value.fullName,
        email: this.volunteerForm.value.email,
        interests: this.volunteerForm.value.interests || '',
        submittedAt: new Date(),
        status: 'new',
        source: 'volunteer-signup'
      };

      await this.firestoreService.addDoc('volunteer-leads', formData);
      
      this.isSuccess = true;
      this.volunteerForm.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.isSuccess = false;
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting volunteer form:', error);
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

