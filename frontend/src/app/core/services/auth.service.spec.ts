import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({ template: '', standalone: true })
class StubComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: StubComponent }]),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('register() posts credentials and stores token', () => {
    const mockResponse = {
      token: 'jwt-token',
      user: { id: '1', email: 'julko@vouchus.com', username: 'julko' },
    };

    service.register('julko@vouchus.com', 'julko', 'password123').subscribe((res) => {
      expect(res.token).toBe('jwt-token');
    });

    const req = http.expectOne(`${API}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'julko@vouchus.com',
      username: 'julko',
      password: 'password123',
    });
    req.flush(mockResponse);

    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser?.username).toBe('julko');
  });

  it('login() posts credentials and stores token', () => {
    const mockResponse = {
      token: 'login-token',
      user: { id: '1', email: 'julko@vouchus.com', username: 'julko' },
    };

    service.login('julko@vouchus.com', 'password123').subscribe();

    const req = http.expectOne(`${API}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser?.username).toBe('julko');
  });

  it('logout() clears storage and user state', () => {
    localStorage.setItem('auth_token', 'some-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: '1', email: 'julko@vouchus.com', username: 'julko' }),
    );

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser).toBeNull();
  });

  it('isLoggedIn() returns false when no token in storage', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('initializes with stored user on startup', () => {
    const user = { id: '1', email: 'julko@vouchus.com', username: 'julko' };
    localStorage.setItem('auth_token', 'tok');
    localStorage.setItem('auth_user', JSON.stringify(user));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: StubComponent }]),
      ],
    });
    const freshService = TestBed.inject(AuthService);

    expect(freshService.currentUser?.username).toBe('julko');
    expect(freshService.isLoggedIn()).toBe(true);

    TestBed.inject(HttpTestingController).verify();
  });
});
