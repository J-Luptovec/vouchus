import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getProducts() calls correct URL with default pagination', () => {
    service.getProducts().subscribe();
    const req = http.expectOne((r) => r.url === `${API}/products`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('12');
    req.flush({ products: [], total: 0, page: 1, limit: 12, totalPages: 0 });
  });

  it('getProducts() passes custom page and limit', () => {
    service.getProducts(2, 6).subscribe();
    const req = http.expectOne((r) => r.url === `${API}/products`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('6');
    req.flush({ products: [], total: 0, page: 2, limit: 6, totalPages: 0 });
  });

  it('getProduct() calls correct URL', () => {
    service.getProduct('abc-123').subscribe();
    const req = http.expectOne(`${API}/products/abc-123`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'abc-123', name: 'Widget', price: 9.99 });
  });
});
