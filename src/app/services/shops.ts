import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopsService {
  private apiUrl = `${getApiUrl()}/shop`;

  constructor(private http: HttpClient) {}

  getAllShops(): Observable<{ shops: any[] }> {
    const token = localStorage.getItem('token');

    return this.http.get<{ shops: any[] }>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createShop(payload: { name: string; email: string; phone: string }): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.apiUrl}/save`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateShop(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.put(`${this.apiUrl}/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteShop(id: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.apiUrl}/delete/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
