import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  buyProduct(productId: string) {
    return this.http.post(`${environment.apiUrl}/products/${productId}/orders`, {});
  }
}
