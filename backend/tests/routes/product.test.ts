import request from 'supertest';
import app from '../../src/app';
import { createProduct, createUser, createOrder } from '../helpers/db';
import { authHeader } from '../helpers/auth';

describe('GET /api/products', () => {
  it('returns paginated products', async () => {
    await Promise.all([createProduct({ name: 'Product A' }), createProduct({ name: 'Product B' })]);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(2);
    expect(res.body).toHaveProperty('total', 2);
    expect(res.body).toHaveProperty('totalPages');
  });

  it('respects page and limit query params', async () => {
    await Promise.all(Array.from({ length: 5 }, (_, i) => createProduct({ name: `Product ${i}` })));

    const res = await request(app).get('/api/products?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(2);
    expect(res.body.total).toBe(5);
  });
});

describe('GET /api/products/:id', () => {
  it('returns product with hasPurchased=false for guest', async () => {
    const product = await createProduct();

    const res = await request(app).get(`/api/products/${product.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Test Product', hasPurchased: false });
  });

  it('returns hasPurchased=true for authenticated user who bought', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);
    await createOrder(user.id, product.id);

    const res = await request(app)
      .get(`/api/products/${product.id}`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(200);
    expect(res.body.hasPurchased).toBe(true);
  });

  it('returns hasPurchased=false for authenticated user who has not bought', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);

    const res = await request(app)
      .get(`/api/products/${product.id}`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(200);
    expect(res.body.hasPurchased).toBe(false);
  });

  it('returns 404 for unknown product', async () => {
    const res = await request(app).get('/api/products/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
