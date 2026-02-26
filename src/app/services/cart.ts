import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from './api';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  shop: string;
  shopId: string;
  price: number;
  quantity: number;
  attributes: any;
  image: string;
  addedAt: number; // timestamp pour expiration
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${getApiUrl()}/order`;

  private cartKey = 'app_cart';
  private cartTTL = 10 * 60 * 1000; // 10 minutes en ms

  private _cart = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this._cart.asObservable();

  constructor(
    private http: HttpClient
  ) {
    this.cleanupExpiredItems();
  }

  checkout(token: string) {
    const cart = this.loadCart();
    return this.http.post(this.apiUrl, { cart }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  private loadCart(): CartItem[] {
    const raw = localStorage.getItem(this.cartKey);
    if (!raw) return [];

    try {
      const items: CartItem[] = JSON.parse(raw);
      const now = Date.now();

      const validItems = items.filter(item => 
        now - item.addedAt <= this.cartTTL
      );

      // 🔥 IMPORTANT : si des items ont expiré, on met à jour le storage
      if (validItems.length !== items.length) {
        this.saveCart(validItems);
      }

      return validItems;

    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this._cart.next(items);
  }

  addToCart(item: CartItem) {
    const cart = this.loadCart();

    // Vérifie si le même produit + mêmes attributs existe
    const index = cart.findIndex(i =>
      i.id === item.id &&
      JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
    );

    if (index !== -1) {
      cart[index].quantity += item.quantity;
      cart[index].addedAt = Date.now();
    } else {
      item.addedAt = Date.now();
      cart.push(item);
    }

    this.saveCart(cart);
  }

  removeItem(index: number) {
    const cart = this.loadCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this._cart.next([]);
  }

  private cleanupExpiredItems() {
    setInterval(() => {
      const cart = this.loadCart();
      const now = Date.now();
      const filtered = cart.filter(i => now - i.addedAt <= this.cartTTL);

      if (filtered.length !== cart.length) {
        this.saveCart(filtered);
      }
    }, 60 * 1000); // vérifie chaque minute
  }

  updateQuantity(index: number, quantity: number) {
    const cart = this.loadCart();
    cart[index].quantity = quantity;
    cart[index].addedAt = Date.now();
    this.saveCart(cart);
  }

  
}