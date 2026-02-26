import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../services/customers';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customers',
  imports: [
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit{
  customers: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private dialog: MatDialog,
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers()
  }

  retry(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.cdr.detectChanges();
    
    this.customersService.getCustomers().subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        
        if (response && response.customers) {
          this.customers = response.customers;
        } else if (Array.isArray(response)) {
          this.customers = response;
        }
        
        this.isLoading = false;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement clients:', err);
        this.errorMessage = err.error?.message || 'Erreur de chargement des clients';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
