const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('SESSION', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a session', async () => {
    const ongRequest = await request(app)
      .post('/ongs')
      .send({
        name: "Apad",
        email: "contato@apad.com.br",
        whatsapp: "47000000000",
        city: "São Paulo",
        uf: "SP"
      });
      
    const response = await request(app)
      .post('/sessions')
      .send({
        id: ongRequest.body.id
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });

  it('should be able to list user incidents', async () => {
    const ongRequest = await request(app)
      .post('/ongs')
      .send({
        name: "Apad",
        email: "contato@apad.com.br",
        whatsapp: "47000000000",
        city: "São Paulo",
        uf: "SP"
      });

    await request(app)
      .post('/incidents')
      .send({
        title: "Caso 1",
        description: "Detalhes do caso",
        value: 300
      })
      .set('authorization', ongRequest.body.id);

    const response = await request(app)
      .get('/profile')
      .set('authorization', ongRequest.body.id);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('value');
    expect(response.body[0]).toHaveProperty('ong_id');
  });
});