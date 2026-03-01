import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoxesService {
  private apiUrl = `${getApiUrl()}/box`;
  constructor(private http: HttpClient) {}

  getAllBox(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}`, { headers: { Authorization: `Bearer ${token}` } });
  }

  createBox(payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.apiUrl}/save`, payload, { headers: { Authorization: `Bearer ${token}` } });
  }

  updateBox(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteBox(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/delete/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
