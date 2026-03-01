import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/oders';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-orders-detail',
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './orders-detail.html',
  styleUrl: './orders-detail.css',
})
export class OrdersDetail implements OnInit{
  order: any = null;
  loading = true;
  updating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrderDetail();
  }

  orderDelivered() {
    if (!confirm('Marquer cette commande comme livrée ?')) return;

    this.updating = true;
    const token = localStorage.getItem('token');
    if (!token) return;

    this.orderService.orderDelivered(token, this.order._id).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder; 
        this.updating = false;

        this.loadOrderDetail();
      },
      error: (err) => {
        console.error('Erreur mise à jour statut :', err);
        alert('Impossible de mettre la commande à livrée.');
        this.updating = false;
      }
    });
  }

  loadOrderDetail() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.router.navigate(['/admin/orders']);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login-admin']);
      return;
    }

    this.orderService.getOrderDetail(token,orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login-admin']);
      }
    });
  }

  getGradient(item: any) {
    const colors = ['#e8ddd0', '#d4c5b0', '#d0dde8', '#b8cadc', '#e8d0d8', '#d4b8c4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${color}, #fff)`;
  }
}
