import request from 'supertest';
import app from '../../src/app';
import { createUser, createProduct, createOrder, createReview } from '../helpers/db';
import { authHeader } from '../helpers/auth';

describe('GET /api/products/:productId/reviews', () => {
  it('returns paginated reviews for a product', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createReview(user.id, product.id, { rating: 5, body: 'Excellent!' });

    const res = await request(app).get(`/api/products/${product.id}/reviews`);

    expect(res.status).toBe(200);
    expect(res.body.reviews).toHaveLength(1);
    expect(res.body.reviews[0]).toMatchObject({ rating: 5, body: 'Excellent!' });
  });
});

describe('POST /api/products/:productId/reviews', () => {
  it('creates a review after purchasing', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);

    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 5, body: 'Amazing product!', pros: ['Fast', 'Reliable'], cons: [] });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      rating: 5,
      body: 'Amazing product!',
      pros: ['Fast', 'Reliable'],
    });
  });

  it('updates avgRating on the product after creating a review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);

    await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 4, body: 'Pretty good product!', pros: [], cons: [] });

    const productRes = await request(app).get(`/api/products/${product.id}`);
    expect(productRes.body.avgRating).toBeCloseTo(4);
  });

  it('returns 403 if user has not purchased', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);

    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 3, body: 'Some review body here', pros: [], cons: [] });

    expect(res.status).toBe(403);
  });

  it('returns 409 if user already reviewed', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);
    await createReview(user.id, product.id);

    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 4, body: 'Second review attempt', pros: [], cons: [] });

    expect(res.status).toBe(409);
  });

  it('returns 422 for invalid rating', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);

    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 10, body: 'Some body', pros: [], cons: [] });

    expect(res.status).toBe(422);
  });

  it('returns 401 for unauthenticated request', async () => {
    const product = await createProduct();
    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .send({ rating: 4, body: 'Review body text', pros: [], cons: [] });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/products/:productId/reviews/:reviewId', () => {
  it('updates own review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);
    const review = await createReview(user.id, product.id, { rating: 3 });

    const res = await request(app)
      .patch(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 5, body: 'Updated opinion!', pros: ['Better now'], cons: [] });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ rating: 5, body: 'Updated opinion!' });
  });

  it('updates avgRating on the product after editing a review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);
    const review = await createReview(user.id, product.id, { rating: 2 });

    await request(app)
      .patch(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(user.id, user.username))
      .send({ rating: 5, body: 'Changed my mind!', pros: [], cons: [] });

    const productRes = await request(app).get(`/api/products/${product.id}`);
    expect(productRes.body.avgRating).toBeCloseTo(5);
  });

  it("returns 403 when editing another user's review", async () => {
    const [owner, attacker, product] = await Promise.all([
      createUser({ username: 'julko', email: 'julko@vouchus.com' }),
      createUser({ username: 'intruder', email: 'intruder@vouchus.com' }),
      createProduct(),
    ]);
    await createOrder(owner.id, product.id);
    const review = await createReview(owner.id, product.id);

    const res = await request(app)
      .patch(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(attacker.id, attacker.username))
      .send({ rating: 1, body: 'Vandalized review body', pros: [], cons: [] });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/products/:productId/reviews/:reviewId', () => {
  it('deletes own review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);
    const review = await createReview(user.id, product.id);

    const res = await request(app)
      .delete(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(204);
  });

  it('resets avgRating on the product after deleting the only review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);
    const review = await createReview(user.id, product.id, { rating: 5 });

    await request(app)
      .delete(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(user.id, user.username));

    const productRes = await request(app).get(`/api/products/${product.id}`);
    expect(productRes.body.avgRating).toBeNull();
  });

  it("returns 403 when deleting another user's review", async () => {
    const [owner, attacker, product] = await Promise.all([
      createUser({ username: 'julko', email: 'julko@vouchus.com' }),
      createUser({ username: 'intruder', email: 'intruder@vouchus.com' }),
      createProduct(),
    ]);
    await createOrder(owner.id, product.id);
    const review = await createReview(owner.id, product.id);

    const res = await request(app)
      .delete(`/api/products/${product.id}/reviews/${review.id}`)
      .set(authHeader(attacker.id, attacker.username));

    expect(res.status).toBe(403);
  });

  it('returns 404 for unknown review', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);

    const res = await request(app)
      .delete(`/api/products/${product.id}/reviews/00000000-0000-0000-0000-000000000000`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(404);
  });
});
