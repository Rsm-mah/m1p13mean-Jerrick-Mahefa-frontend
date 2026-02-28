import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../../services/oders';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-orders',
  imports: [
    [Navbar],
    CommonModule,
    RouterLink
    ,FooterComponent
  ],
  templateUrl: './public-orders.html',
  styleUrl: './public-orders.css',
})
export class PublicOrders implements OnInit{
  orders: Order[] = [];
  totalOrders = 0;
  totalSpent = 0;
  inProgress = 0;

  constructor(
    private orderService: OrderService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.orderService.getUserOrders(token).subscribe({
      next: (orders) => {
        this.orders = orders;

        this.totalOrders = orders.length;
        this.totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        this.inProgress = orders.filter(o => o.status === 'EN COURS').length;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      }
    });
  }

  getPreviewNames(items: any[]): string {
    if (!items || items.length === 0) return '';
    const names = items.slice(0, 3).map(i => i.productName);
    return names.join(', ');
  }

  getExtraItemsCount(items: any[]): number {
    if (!items) return 0;
    return items.length > 3 ? items.length - 3 : 0;
  }

  getGradient(item: any): string {
    const colors = ['#e8ddd0','#d4c5b0','#d0dde8','#b8cadc','#e8d0d8','#d4b8c4'];
    const c1 = colors[Math.floor(Math.random()*colors.length)];
    const c2 = colors[Math.floor(Math.random()*colors.length)];
    return `linear-gradient(135deg, ${c1}, ${c2})`;
  }
}
