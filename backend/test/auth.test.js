const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Authentication API Suite', () => {
  it('should return 400 if registration fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });

  it('should return 400 if login credentials are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });

  it('should return 401 for unauthorized access to notes endpoint', async () => {
    const res = await request(app).get('/api/notes');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.equal(false);
  });
});