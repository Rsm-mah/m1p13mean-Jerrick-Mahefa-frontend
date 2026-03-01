import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthAdminService } from '../services/auth-admin';
import { FooterComponent } from '../components/footer/footer';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    FooterComponent
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  currentUser: any;
  searchQuery = '';

  private baseMenuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
      badge: null
    },
    {
      title: 'Produits',
      icon: 'inventory_2',
      route: '/admin/products',
    },
    {
      title: 'Catégories',
      icon: 'category',
      route: '/admin/categories',
      badge: null
    },
    {
      title: 'Commandes',
      icon: 'shopping_cart',
      route: '/admin/orders',
    },
    {
      title: 'Clients',
      icon: 'people',
      route: '/admin/customers',
      badge: null
    },
    {
      title: 'Boutiques',
      icon: 'store',
      route: '/admin/shops',
      badge: null
    },
    {
      title: 'Boxes',
      icon: 'inventory',
      route: '/admin/boxes'
    }
  ];

  menuItems = [...this.baseMenuItems];

  constructor(
    private authService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // If the current user is not an ADMIN, hide category and customer menu items
    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
      this.menuItems = this.baseMenuItems.filter(item => {
        return item.route !== '/admin/categories' && item.route !== '/admin/customers' && item.route !== '/admin/shops' && item.route !== '/admin/boxes';
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}