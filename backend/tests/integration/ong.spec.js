const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a new ong', async () => {
    const response = await request(app)
      .post('/ongs')
      .send({
        name: "Apad",
        email: "contato@apad.com.br",
        whatsapp: "47000000000",
        city: "São Paulo",
        uf: "SP"
      });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });

  it('should be able to list all ongs', async () => {
    await request(app)
      .post('/ongs')
      .send({
        name: "Apad",
        email: "contato@apad.com.br",
        whatsapp: "47000000000",
        city: "São Paulo",
        uf: "SP"
      });

    const response = await request(app)
      .get('/ongs');

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('whatsapp');
    expect(response.body[0]).toHaveProperty('city');
    expect(response.body[0]).toHaveProperty('uf');
  });
});