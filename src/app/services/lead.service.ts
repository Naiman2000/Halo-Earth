import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable, map } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

export interface Lead {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  message?: string;
  contacted?: boolean;
  status?: 'new' | 'read' | 'archived';
  submittedAt?: Timestamp | Date;
  type?: 'contact' | 'signup' | 'other';
  data?: any;
}

interface VolunteerLeadData {
  id?: string;
  fullName?: string;
  email?: string;
  interests?: string;
  phone?: string;
  message?: string;
  submittedAt?: Timestamp | Date;
  status?: 'new' | 'read' | 'archived';
  contacted?: boolean;
  source?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private firestoreService = inject(FirestoreService);
  private collectionPath = 'volunteer-leads';

  getLeads(): Observable<Lead[]> {
    return this.firestoreService.getCollection<VolunteerLeadData>(this.collectionPath).pipe(
      map(leads => leads.map(lead => this.mapToLead(lead)))
    );
  }

  async updateLeadStatus(id: string, status: 'new' | 'read' | 'archived'): Promise<void> {
    if (!id) {
      throw new Error('Lead ID is required');
    }
    await this.firestoreService.updateDoc(this.collectionPath, id, { status });
  }

  async updateLeadContacted(id: string, contacted: boolean): Promise<void> {
    if (!id) {
      throw new Error('Lead ID is required');
    }
    await this.firestoreService.updateDoc(this.collectionPath, id, { contacted });
  }

  private mapToLead(data: VolunteerLeadData): Lead {
    return {
      id: data.id,
      name: data.fullName || data['name'],
      email: data.email,
      phone: data.phone,
      program: data.interests || data['program'],
      message: data.message,
      contacted: data.contacted ?? false,
      status: data.status || 'new',
      submittedAt: data.submittedAt,
      type: 'signup',
      data: data
    };
  }
}

