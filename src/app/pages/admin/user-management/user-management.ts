import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit, OnDestroy {
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedUser = signal<User | null>(null);
  
  createUserForm: FormGroup;
  editUserForm: FormGroup;
  
  private subscription?: Subscription;

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 10;
  totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.itemsPerPage));
  
  // For template access
  Math = Math;

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers().slice(start, end);
  });

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required]],
      role: ['admin', [Validators.required]]
    });

    this.editUserForm = this.fb.group({
      displayName: ['', [Validators.required]],
      role: ['admin', [Validators.required]],
      active: [true]
    });
  }

  async ngOnInit(): Promise<void> {
    // Wait for auth state to be ready
    let attempts = 0;
    let currentUser = this.authService.getCurrentUser();
    
    // Wait up to 3 seconds for auth to initialize
    while (!currentUser && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      currentUser = this.authService.getCurrentUser();
      attempts++;
    }
    
    if (!currentUser) {
      alert('Not authenticated. Please log in first.');
      window.location.href = '/admin/login';
      return;
    }
    
    // Wait for user data to load from Firestore
    await this.authService.refreshUserData();
    
    // Wait a bit more to ensure the signal has updated
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user can access this page
    const userData = this.authService.getUserData();
    const isSuperAdmin = this.authService.isSuperAdmin();
    const userId = this.authService.getCurrentUser()?.uid;
    
    if (!isSuperAdmin) {
      const errorMsg = userData 
        ? `Access denied: Only super admins can manage users. Your current role is: "${userData.role}". Please ensure your user document in Firestore (users/${userId}) has role set to 'super-admin'.`
        : `Access denied: Only super admins can manage users. User document not found in Firestore. Please ensure a user document exists at users/${userId} with role set to 'super-admin'.`;
      
      alert(errorMsg);
      return;
    }
    
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.subscription = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        alert('Error loading users. Please try again.');
      }
    });
  }

  filterUsers(): void {
    const term = this.searchTerm().toLowerCase().trim();
    const filtered = this.users().filter(user => {
      return (
        user.email?.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
    this.filteredUsers.set(filtered);
    this.currentPage.set(1);
  }

  openCreateModal(): void {
    this.createUserForm.reset({
      email: '',
      password: '',
      displayName: '',
      role: 'admin'
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.createUserForm.reset();
  }

  async onCreateSubmit(): Promise<void> {
    if (this.createUserForm.invalid) {
      this.markFormGroupTouched(this.createUserForm);
      return;
    }

    try {
      const { email, password, displayName, role } = this.createUserForm.value;
      
      // Store super admin's email before creating user (they'll be signed out)
      const superAdminEmail = this.authService.getCurrentUser()?.email;
      if (superAdminEmail) {
        localStorage.setItem('pendingReLoginEmail', superAdminEmail);
      }
      
      await this.userService.createUser(email, password, displayName, role);
      this.closeCreateModal();
      
      // Note: The super admin is now signed out because Firebase Auth signed in the new user
      // This is a limitation of Firebase Auth client SDK
      // Redirect to login with email pre-filled
      window.location.href = '/admin/login';
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(error.message || 'Failed to create user. Please try again.');
      // Clear the pending re-login email if creation failed
      localStorage.removeItem('pendingReLoginEmail');
    }
  }

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.editUserForm.patchValue({
      displayName: user.displayName || '',
      role: user.role || 'admin',
      active: user.active !== false
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
    this.editUserForm.reset();
  }

  async onEditSubmit(): Promise<void> {
    if (this.editUserForm.invalid || !this.selectedUser()?.id) {
      this.markFormGroupTouched(this.editUserForm);
      return;
    }

    try {
      const formValue = this.editUserForm.value;
      await this.userService.updateUser(this.selectedUser()!.id!, formValue);
      this.closeEditModal();
      this.loadUsers();
      alert('User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user. Please try again.');
    }
  }

  openDeleteModal(user: User): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  async confirmDelete(): Promise<void> {
    if (!this.selectedUser()?.id) {
      return;
    }

    try {
      await this.userService.deleteUser(this.selectedUser()!.id!);
      this.closeDeleteModal();
      this.loadUsers();
      alert('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user. Please try again.');
    }
  }

  getRoleBadgeClass(role: UserRole | undefined): string {
    return role === 'super-admin' ? 'danger' : 'primary';
  }

  getStatusBadgeClass(active: boolean | undefined): string {
    return active !== false ? 'success' : 'secondary';
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

