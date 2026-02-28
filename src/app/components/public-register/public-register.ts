import { Component } from '@angular/core';
import { CustomersService } from '../../services/customers';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-register',
  imports: [
    CommonModule,
    FormsModule
    ,FooterComponent
  ],
  templateUrl: './public-register.html',
  styleUrl: './public-register.css',
})
export class PublicRegister {
  customer = {
    name: '',
    first_name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  };

  loading = false;
  message = '';

  constructor(
    private customerService: CustomersService, 
    private router: Router
  ) {}

  register() {
    this.loading = true;
    this.message = '';

    this.customerService.registerCustomer(this.customer).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message;
        console.log('Compte créé:', res);
        // Redirection vers la page de connexion
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Erreur lors de la création du compte';
        console.error(err);
      }
    });
  }
}
