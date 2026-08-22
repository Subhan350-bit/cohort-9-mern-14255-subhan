const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Authentication & Note Route Tests', () => {
  it('should reject registration if fields are missing or whitespace', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: '   ', email: '', password: '' });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });

  it('should reject login with empty credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });

  it('should return 401 when accessing notes without Bearer authorization', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Basic invalidtokenformat');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.equal(false);
  });

  it('should return 401 when token is expired or invalid', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Bearer bad.token.here');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.equal(false);
  });
});