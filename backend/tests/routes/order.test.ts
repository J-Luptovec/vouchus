import request from 'supertest';
import app from '../../src/app';
import { createUser, createProduct } from '../helpers/db';
import { authHeader } from '../helpers/auth';

describe('POST /api/products/:productId/orders', () => {
  it('creates an order and returns it', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct({ price: 49.99 })]);

    const res = await request(app)
      .post(`/api/products/${product.id}/orders`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      priceAtPurchase: 49.99,
      product: { id: product.id, name: product.name },
    });
  });

  it('allows buying the same product multiple times', async () => {
    const [user, product] = await Promise.all([createUser(), createProduct()]);

    await request(app)
      .post(`/api/products/${product.id}/orders`)
      .set(authHeader(user.id, user.username));

    const res = await request(app)
      .post(`/api/products/${product.id}/orders`)
      .set(authHeader(user.id, user.username));

    expect(res.status).toBe(201);
  });

  it('returns 401 for unauthenticated request', async () => {
    const product = await createProduct();
    const res = await request(app).post(`/api/products/${product.id}/orders`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for unknown product', async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/products/00000000-0000-0000-0000-000000000000/orders')
      .set(authHeader(user.id, user.username));
    expect(res.status).toBe(404);
  });
});
