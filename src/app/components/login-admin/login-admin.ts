import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthAdminService, AuthError } from '../../services/auth-admin';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-admin.html',
  styleUrls: ['./login-admin.css']
})
export class LoginAdmin implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  authError: AuthError | null = null;
  selectedRole: 'ADMIN' | 'SHOP' = 'ADMIN'; // Valeur par défaut

  // Identifiants par défaut pour chaque rôle
  private credentials = {
    ADMIN: {
      name: 'Admin',
      password: 'Administrateur!'
    },
    SHOP: {
      name: 'Astyl',
      password: 'Astyl!'
    }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const defaultCreds = this.credentials[this.selectedRole];
    this.loginForm = this.fb.group({
      name: [defaultCreds.name, [Validators.required]],
      password: [defaultCreds.password, [Validators.required]]
    });
  }

  setRole(role: 'ADMIN' | 'SHOP'): void {
    this.selectedRole = role;
    const creds = this.credentials[role];
    
    // Mettre à jour le formulaire avec les nouveaux identifiants
    this.loginForm.patchValue({
      name: creds.name,
      password: creds.password
    });

    // Réinitialiser les erreurs
    this.authError = null;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authError = null;
    this.cdr.detectChanges();

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: AuthError) => {
        this.authError = error;
        this.isLoading = false;
        
        this.cdr.detectChanges();
        
        if (error.field) {
          const element = document.querySelector(`[formcontrolname="${error.field}"]`);
          if (element) {
            element.classList.add('shake');
            setTimeout(() => {
              element.classList.remove('shake');
            }, 500);
          }
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    const error = this.authError;
    
    if (error?.field === controlName) {
      return error.message;
    }
    
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    return '';
  }

  hasFieldError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    const error = this.authError;
    
    return (control?.invalid && control?.touched) || error?.field === controlName;
  }
}