import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import {readCarsFile, writeCarsFile} from './Util/ReadAndWrite.js';


// p/ o express, como é uma função, é necessário executá-la para criar a aplicação e só dps usar seus métodos necessários p/ a aplicação.
const app = express();

// já o helmet e o cors, tbm são uma função porém eles retornam um middleware, ou seja, vocẽ pode usar eles diretamente no app.use() sem a necessidade de executá-los, pois o próprio app.use() já executa um middleware.
app.use(helmet());
app.use(cors());
app.use(morgan('dev')); // Método - Rota - Status - Tempo - Tamanho da Resposta

// Criando um middleware para receber JSON
app.use(express.json());


export default app;
