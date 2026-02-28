import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './api';
import { Observable } from 'rxjs';

export interface OrderItem {
  productName: string;
  shopName: string;
  quantity: number;
  price: number;
  attributes: any;
}

export interface Customer {
  _id: string;
  name: string;
  first_name: string;
}

export interface Order {
  _id: string;
  customerId: Customer;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${getApiUrl()}/order`;

  constructor(private http: HttpClient) {}

  orderDelivered(token: string, orderId: string) {
    return this.http.put<Order>(
      `${this.apiUrl}/delivered/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  getOrderDetail(token: string, orderId: string) {
    return this.http.get<Order[]>(`${this.apiUrl}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUserOrders(token: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getRecentOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Order[]>(`${this.apiUrl}/recents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getRecentOrdersForShop(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Order[]>(`${this.apiUrl}/recents/shop`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getStats(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getShopStats(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/stats/shop`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAllOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    
    return this.http.get<Order[]>(`${this.apiUrl}/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getOrderByShop(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/shop`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}