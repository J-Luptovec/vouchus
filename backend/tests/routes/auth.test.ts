import request from 'supertest';
import app from '../../src/app';
import { createUser } from '../helpers/db';

describe('POST /api/auth/register', () => {
  it('creates a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'julko',
      email: 'julko@vouchus.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ username: 'julko', email: 'julko@vouchus.com' });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 422 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'julko',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(res.status).toBe(422);
  });

  it('returns 422 for short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'julko',
      email: 'julko@vouchus.com',
      password: '123',
    });
    expect(res.status).toBe(422);
  });

  it('returns 409 for duplicate email', async () => {
    await createUser({ email: 'julko@vouchus.com' });
    const res = await request(app).post('/api/auth/register').send({
      username: 'other',
      email: 'julko@vouchus.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('returns 409 for duplicate username', async () => {
    await createUser({ username: 'julko' });
    const res = await request(app).post('/api/auth/register').send({
      username: 'julko',
      email: 'other@vouchus.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('returns a token with valid credentials', async () => {
    await createUser();

    const res = await request(app).post('/api/auth/login').send({
      email: 'julko@vouchus.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('returns 401 for wrong password', async () => {
    await createUser();

    const res = await request(app).post('/api/auth/login').send({
      email: 'julko@vouchus.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@vouchus.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user with valid token', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      username: 'julko',
      email: 'julko@vouchus.com',
      password: 'password123',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: 'julko' });
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
