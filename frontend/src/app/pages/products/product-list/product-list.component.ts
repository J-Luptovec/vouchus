import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductsResponse } from '../../../models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    SlicePipe,
    StarRatingComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  response = signal<ProductsResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  limit = signal(12);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getProducts(this.page(), this.limit()).subscribe({
      next: (res) => {
        this.response.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products.');
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.loadProducts();
  }

  trackById(_: number, product: Product) {
    return product.id;
  }
}
