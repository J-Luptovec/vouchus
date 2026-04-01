import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

describe('OrderService', () => {
  let service: OrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('buyProduct() sends POST to correct URL', () => {
    service.buyProduct('prod-123').subscribe();
    const req = http.expectOne(`${API}/products/prod-123/orders`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'order-1', priceAtPurchase: 29.99 });
  });
});
