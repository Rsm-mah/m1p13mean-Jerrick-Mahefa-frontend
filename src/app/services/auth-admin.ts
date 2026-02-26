import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { getApiUrl } from './api';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface AuthError {
  message: string;
  code: number;
  field?: 'name' | 'password';
}

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private apiUrl = `${getApiUrl()}/user`;
  private tokenKey = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        // Décoder le token pour obtenir les infos utilisateur
        const userData = this.decodeToken(response.token);
        localStorage.setItem('user', JSON.stringify({
          name: credentials.name,
          role: userData.role,
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
        message: errorMessage || 'Aucun compte ne correspond à ce nom d\'utilisateur',
        code: 404,
        field: 'name'
      };
    } else if (error.status === 403) {
      authError = {
        message: errorMessage || 'Ce compte est désactivé',
        code: 403,
        field: 'name'
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

  logout(): void {
    this.removeToken();
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login-admin']);
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

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}