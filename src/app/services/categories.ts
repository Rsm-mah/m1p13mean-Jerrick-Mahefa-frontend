import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${getApiUrl()}/category`;
  constructor(private http: HttpClient) {}

  deleteCategory(id: string) {
    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.apiUrl}/delete/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  updateCategory(id: string, category: any) {
    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.apiUrl}/${id}`,
      category,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  getCategoryById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCategories(): Observable<{ categories: any[] }> {
    const token = localStorage.getItem('token');
    
    return this.http.get<{ categories: any[] }>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  createCategory(category: any) {
    const token = localStorage.getItem('token');

    return this.http.post(
      this.apiUrl,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
