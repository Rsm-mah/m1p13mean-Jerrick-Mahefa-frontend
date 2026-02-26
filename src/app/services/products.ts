import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private apiUrl = `${getApiUrl()}/product`;

  constructor(private http: HttpClient) {}

  updateProduct(id: string, formData: FormData) {
    const token = localStorage.getItem('token');
    
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getProductById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getProductByShopId(): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.get<any>(`${this.apiUrl}/shop`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getProducts(categoryId?: string, page: number = 1, limit: number = 12): Observable<any> {
    const token = localStorage.getItem('token');
    let url = this.apiUrl + `?page=${page}&limit=${limit}`;

    if (categoryId && categoryId !== 'all') {
      url += `&category=${categoryId}`;
    }

    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createProduct(formData: FormData) {
    const token = localStorage.getItem('token');

    return this.http.post(
      this.apiUrl,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
