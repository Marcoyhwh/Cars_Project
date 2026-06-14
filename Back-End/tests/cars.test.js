const request = require('supertest');
const app = require('../src/app');

describe('Usando o método GET em /cars', () => {
    it('Retorna a lista completa dos carros', async () => {
        const response = await request(app).get('/cars');

        expect(response.status).toBe(200);
    });

    it('Deve retorna um array de objetos', async () => {
        const response = await request(app).get('/cars');

        expect(Array.isArray(response.body)).toBe(true);
    });

    describe('Usando o método GET em /cars/:id', () => { 
        it('Deve retornar um objeto', async () => {
            const response = await request(app).get('/cars/1');

            expect(response.status).toBe(200);
            expect(typeof response.body).toBe('object');
        });
    });
});