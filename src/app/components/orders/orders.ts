import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order, OrderService } from '../../services/oders';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  orders: Order[] = [];
  totalOrders = 0;
  totalSpent = 0;
  inProgress = 0;
  isLoading = false;
  errorMessage = '';
  role: string | null = null;
  // for shop users
  orderItems: any[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {
    this.isLoading = true;
    const user = localStorage.getItem('user');
    const userDetails = user ? JSON.parse(user) : null;
    this.role = userDetails?.role ?? null;

    if (this.role === 'SHOP') {
      this.orderService.getOrderByShop().subscribe({
        next: (res) => {
          const items = res?.items ?? (Array.isArray(res) ? res : []);
          this.orderItems = items;
          this.totalOrders = items.length;
          this.totalSpent = items.reduce((s: number, it: any) => s + ((it.price || 0) * (it.quantity || 1)), 0);
          this.inProgress = items.filter((it: { status: string; }) => it.status === 'EN COURS').length || 0;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement commandes (shop):', err);
          this.errorMessage = err.error?.message || 'Erreur de chargement des commandes';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.orderService.getAllOrders().subscribe({
        next: (orders) => {
          this.orders = orders;

          this.totalOrders = orders.length;
          this.totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
          this.inProgress = orders.filter(o => o.status === 'EN COURS').length;

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement commandes:', err);
          this.errorMessage = err.error?.message || 'Erreur de chargement des commandes';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  retry() {
    this.loadOrders();
  }

  viewOrderDetails(order: any) {
    // Ici tu peux ouvrir un dialog ou naviguer vers une page détails
    console.log('Voir détails commande :', order);
    const id = order._id || order.orderId || order.order_id || (order.orderId?._id) || order.orderId;
    this.router.navigate(['/admin/orders/detail', id]);
  }
}
