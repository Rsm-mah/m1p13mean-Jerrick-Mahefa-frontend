import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { AuthAdminService } from '../../services/auth-admin';
import { OrderService } from '../../services/oders';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  currentUser: any;
  selectedPeriod = 'today';
  stats: any[] = [];
  recentOrders: any[] = [];

  constructor(
    private authService: AuthAdminService, 
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentOrders();
    this.loadStatsDependingOnRole();
  }

  loadRecentOrders(): void {
    this.orderService.getRecentOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders || [];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur récupération commandes récentes', err);
      }
    });
  }

  loadStatsDependingOnRole(): void {
    const user = this.currentUser;
    if (!user) return;

    if (user.role === 'ADMIN') {
      this.orderService.getStats().subscribe({
        next: (data) => {
          this.stats = [
            { title: "Chiffre d'affaires", value: (data.totalRevenue || 0).toLocaleString('fr-FR') + ' Ar', icon: 'payments', change: '', color: '#3b82f6', trend: 'up' },
            { title: 'Commandes', value: (data.totalOrders || 0).toString(), icon: 'shopping_cart', change: '', color: '#10b981', trend: 'up' },
            { title: 'Clients', value: (data.totalCustomers || 0).toString(), icon: 'people', change: '', color: '#8b5cf6', trend: 'up' },
            { title: 'Produits', value: (data.totalProducts || 0).toString(), icon: 'inventory', change: '', color: '#f59e0b', trend: 'up' }
          ];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur récupération stats dashboard', err)
      });
      return;
    }

    if (user.role === 'SHOP') {
      this.orderService.getShopStats().subscribe({
        next: (data) => {
          this.stats = [
            { title: "Chiffre d'affaires", value: (data.totalRevenue || 0).toLocaleString('fr-FR') + ' Ar', icon: 'payments', change: '', color: '#3b82f6', trend: 'up' },
            { title: 'Commandes', value: (data.totalOrders || 0).toString(), icon: 'shopping_cart', change: '', color: '#10b981', trend: 'up' },
            { title: 'Clients', value: (data.totalCustomers || 0).toString(), icon: 'people', change: '', color: '#8b5cf6', trend: 'up' },
            { title: 'Produits', value: (data.totalProducts || 0).toString(), icon: 'inventory', change: '', color: '#f59e0b', trend: 'up' }
          ];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur récupération stats shop', err)
      });
    }
  }

  getStatusClass(status: string): string {
    const s = (status || '').toString().toUpperCase();
    if (s === 'LIVREE' || s === 'LIVRÉ' || s === 'LIVRÉE') return 'status-delivered';
    if (s === 'EN COURS') return 'status-progress';
    if (s === 'EN ATTENTE') return 'status-pending';
    if (s === 'ANNULEE' || s === 'ANNULEE' || s === 'ANNULE' || s === 'ANNUELLEE') return 'status-cancelled';
    return '';
  }

  getPaymentClass(payment: string): string {
    const classes: {[key: string]: string} = {
      'payé': 'payment-paid',
      'en_attente': 'payment-pending',
      'remboursé': 'payment-refunded'
    };
    return classes[payment] || '';
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
  }
}