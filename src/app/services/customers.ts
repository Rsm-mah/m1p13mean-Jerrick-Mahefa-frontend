import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from './api';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code: number;
  field?: 'email' | 'password';
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiUrl = `${getApiUrl()}/customer`;
  private tokenKey = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerCustomer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        // Décoder le token pour obtenir les infos utilisateur
        const userData = this.decodeToken(response.token);
        localStorage.setItem('user', JSON.stringify({
          name: userData.name,
          first_name: userData.first_name,
        }));
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => this.handleAuthError(error));
      })
    );
  }

  private handleAuthError(error: HttpErrorResponse): AuthError {
    console.log('Erreur :', error);
    
    let errorMessage = '';
    
    if (error.error) {
      if (typeof error.error === 'object' && error.error.error) {
        errorMessage = error.error.error;
      }
      else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }

    let authError: AuthError = {
      message: errorMessage || 'Une erreur est survenue lors de la connexion',
      code: error.status
    };

    if (error.status === 404) {
      authError = {
        message: errorMessage || 'Aucun compte ne correspond à cet email',
        code: 404,
        field: 'email'
      };
    } else if (error.status === 403) {
      authError = {
        message: errorMessage || 'Ce compte est désactivé',
        code: 403,
        field: 'email'
      };
    } else if (error.status === 401) {
      authError = {
        message: errorMessage || 'Le mot de passe que vous avez entré est incorrect',
        code: 401,
        field: 'password'
      };
    } else {
      authError = {
        message: errorMessage || authError.message,
        code: error.status
      };
    }

    return authError;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return {};
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.get<{ customers: any[] }>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateCustomer(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put(
      `${this.apiUrl}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  deleteAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put(
      `${this.apiUrl}/delete`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put<{ customers: any[] }>(`${this.apiUrl}/update-password`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCustomers(): Observable<{ customers: any[] }> {
    const token = localStorage.getItem('token');
    
    return this.http.get<{ customers: any[] }>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
