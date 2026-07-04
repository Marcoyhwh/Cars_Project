const request = require('supertest');
const app = require('../src/app');
const { postFile } = require('./data/postTest');

describe('Usando o método GET em /garage', () => {
    it('Retorna a lista completa dos carros', async () => {
        const response = await request(app).get('/garage');

        expect(response.status).toBe(200);
    });

    it('Deve retornar um array de objetos', async () => {
        const response = await request(app).get('/garage');

        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Usando o método GET em /garage/:brandID', () => {
    it('Deve retornar um status 200 (OK)', async () => {
        const response = await request(app).get('/garage/1');

        expect(response.status).toBe(200);
    });

    it('Deve retornar um objeto', async () => {
        const response = await request(app).get('/garage/1');

        expect(typeof response.body === 'object' && response.body != null && Array.isArray(response.body) === false).toBe(true);
    });
});

describe('Usando o método POST em /garage', () => {
    it('Deve retornar um status 201 (Sucessfully)', async () => {
        const response = await request(app).post('/garage').send(postFile);

        expect(response.status).toBe(201);
    });
});

describe('Usando o método PATCH em /garage/:brandID/models/modelID/cars/carID', () => {
    it('Deve validar se a troca no nome foi bem sucedida', async () => {
        const Route = '/garage/1/models/2/cars/1'
        const Response = await request(app).patch(Route).send({ "name": 'testName' });
        const Validation = await request(app).get(Route);

        expect(Validation.body.name).toBe('testName');
        expect(Response.status).toBe(200);

    })

});