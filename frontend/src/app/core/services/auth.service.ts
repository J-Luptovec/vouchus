import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUser$ = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  readonly user$ = this.currentUser$.asObservable();

  register(email: string, username: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, username, password })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get currentUser(): User | null {
    return this.currentUser$.getValue();
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    this.currentUser$.next(res.user);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
