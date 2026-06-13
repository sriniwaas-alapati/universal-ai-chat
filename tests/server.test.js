const request = require('supertest');
const app = require('../server');

describe('Server Endpoints', () => {
  it('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });

  it('GET /unknown-route serves index.html', async () => {
    const res = await request(app).get('/some-random-page');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });
});

describe('POST /api/relay', () => {
  it('fails if targetUrl is missing', async () => {
    const res = await request(app).post('/api/relay').send({
      body: { message: 'hello' }
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('targetUrl is required');
  });

  it('fails if targetUrl is invalid', async () => {
    const res = await request(app).post('/api/relay').send({
      targetUrl: 'not-a-url',
      body: { message: 'hello' }
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Invalid targetUrl');
  });
});
