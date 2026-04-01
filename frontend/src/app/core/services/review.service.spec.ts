import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;
const PRODUCT_ID = 'prod-1';
const REVIEW_ID = 'rev-1';

describe('ReviewService', () => {
  let service: ReviewService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReviewService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getReviews() calls correct URL with pagination', () => {
    service.getReviews(PRODUCT_ID).subscribe();
    const req = http.expectOne((r) => r.url === `${API}/products/${PRODUCT_ID}/reviews`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    req.flush({ reviews: [], total: 0, page: 1, limit: 10, totalPages: 0 });
  });

  it('createReview() posts with correct payload', () => {
    service.createReview(PRODUCT_ID, 5, 'Great!', ['Fast'], ['Expensive']).subscribe();
    const req = http.expectOne(`${API}/products/${PRODUCT_ID}/reviews`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      rating: 5,
      body: 'Great!',
      pros: ['Fast'],
      cons: ['Expensive'],
    });
    req.flush({ id: REVIEW_ID, rating: 5, body: 'Great!' });
  });

  it('updateReview() sends PATCH to correct URL', () => {
    service.updateReview(PRODUCT_ID, REVIEW_ID, 4, 'Updated', [], []).subscribe();
    const req = http.expectOne(`${API}/products/${PRODUCT_ID}/reviews/${REVIEW_ID}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ rating: 4, body: 'Updated', pros: [], cons: [] });
    req.flush({ id: REVIEW_ID, rating: 4, body: 'Updated' });
  });

  it('deleteReview() sends DELETE to correct URL', () => {
    service.deleteReview(PRODUCT_ID, REVIEW_ID).subscribe();
    const req = http.expectOne(`${API}/products/${PRODUCT_ID}/reviews/${REVIEW_ID}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
