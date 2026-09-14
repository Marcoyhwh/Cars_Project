// Jest é um ambiente própio e por padrão ele lida com CommonJS, pra ele ler em ESModule tem que instalar uma bibliota babel sla oq.
import supertest from 'supertest';
import postFile from './data/postTest.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config' 

import app from '../src/app.js';
import '../src//Routes/brand.routes.js';
import '../src/Routes/users.routes.js';



// ADMIN
const adminToken = jwt.sign(
    {
        id: '123456',
        email: 'admin@email.com',
        role: 'ADMIN' // nesses 3 campos estou mandando o que na rota de Login ele espera receber, ele assim então cria o token de ADMIN
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    }
);


// STANDARD
const standardToken = jwt.sign(
    {
        id: '78910',
        email: 'standard@email.com',
        role: 'STANDARD' // nesses 3 campos estou mandando o que na rota de Login ele espera receber, ele assim então cria o token de ADMIN
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    }
);


describe('Usando o método GET em /Brand', () => {
    it('Retorna a lista completa de todos os carros', async () => {
        const response = await supertest(app).get('/Brand');

        expect(response.status).toBe(200);
    });

    it('Retorna a lista completa dos carros por marca', async () => {
        const response = await supertest(app).get('/Brand?brandID=1');

        expect(response.status).toBe(200);
    });

    it('Retorna a lista completa dos carros por modelo', async () => {
        const response = await supertest(app).get('/Brand?brandID=1&modelID=1');

        expect(response.status).toBe(200);
    });

    it('Retorna o carro específico', async () => {
        const response = await supertest(app).get('/Brand?brandID=1&modelID=1&carID=1');

        expect(response.status).toBe(200);
    });
});


describe('Usando o método POST em /Brand', () => {

    it('Deve retornar um status 201 (Sucessfully)', async () => {

        const response = await supertest(routes).post('/Brand').set('Authorization', `Bearer ${adminToken}`).send(postFile);

        expect(response.status).toBe(201);
    });


    it('Deve retornar um status 403 (Fail)', async () => { // 403 é erro que vc não tem permissão

        const response = await supertest(routes).post('/Brand').set('Authorization', `Bearer ${standardToken}`).send(postFile);

        expect(response.status).toBe(201);
    });
});

describe('Usando o método PATCH em /Brand', () => {

    it('Deve validar se a troca no nome foi bem sucedida', async () => {
        const Route = '/Brand?carID=1'
        const Response = await supertest(routes).patch(Route).set('Authorization', `Bearer ${adminToken}`).send({ "Car": 'carParhTest' });
        const Validation = await supertest(routes).get(Route);

        expect(Validation.body.name).toBe('carParhTest');
        expect(Response.status).toBe(200);

    })

    it('Deve validar se a troca no nome deu sem permissão', async () => {
        const Route = '/Brand?carID=1'
        const Response = await supertest(routes).patch(Route).set('Authorization', `Bearer ${standardToken}`).send({ "Car": 'carParhTest' });
        expect(Response.status).toBe(403);

    })

});