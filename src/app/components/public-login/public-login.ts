import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService, AuthError } from '../../services/customers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './public-login.html',
  styleUrls: ['./public-login.css'],
})
export class PublicLogin {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    this.isLoading = true;

    this.customersService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (error: AuthError) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        this.cdr.detectChanges();
      }
    });
  }

}