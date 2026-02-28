import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { CartItem, CartService } from '../../services/cart';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Navbar
    ,FooterComponent
  ],
  templateUrl: './public-cart.html',
  styleUrl: './public-cart.css',
})
export class PublicCart implements OnInit {

  cart: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
    });
  }

  checkout() {
    const token = localStorage.getItem('token');
    if (!token) {
      // rediriger vers login
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.checkout(token).subscribe({
      next: (res: any) => {
        alert('Commande passée avec succès !');
        this.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        if (err.status === 401) {
          // token invalide → redirection login
          this.router.navigate(['/login']);
        } else {
          alert('Erreur lors de la commande');
        }
      }
    });
  }

  // 🔼 Augmenter quantité
  increaseQty(index: number): void {
    const item = this.cart[index];
    this.cartService.updateQuantity(index, item.quantity + 1);
  }

  // 🔽 Diminuer quantité
  decreaseQty(index: number): void {
    const item = this.cart[index];
    if (item.quantity > 1) {
      this.cartService.updateQuantity(index, item.quantity - 1);
    }
  }

  // ❌ Supprimer article
  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  // 🧹 Vider panier
  clearCart(): void {
    this.cartService.clearCart();
  }

  // 💰 Sous-total
  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // 🧮 Total articles
  get totalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}