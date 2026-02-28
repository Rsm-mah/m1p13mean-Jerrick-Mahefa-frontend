import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/oders';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-orders-detail',
  imports: [
    [Navbar],
    CommonModule,
    FooterComponent
  ],
  templateUrl: './public-orders-detail.html',
  styleUrl: './public-orders-detail.css',
})
export class PublicOrdersDetail implements OnInit{
  order: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.router.navigate(['/orders']);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
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
        this.router.navigate(['/login']);
      }
    });
  }

  getGradient(item: any) {
    const colors = ['#e8ddd0', '#d4c5b0', '#d0dde8', '#b8cadc', '#e8d0d8', '#d4b8c4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${color}, #fff)`;
  }
}
