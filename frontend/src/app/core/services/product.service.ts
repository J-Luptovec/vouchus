import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, ProductsResponse } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(page = 1, limit = 12) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products`, { params });
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }
}
