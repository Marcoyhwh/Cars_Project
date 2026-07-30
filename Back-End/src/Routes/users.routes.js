import bcrypt from 'bcrypt';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


// Buscar todos os usuários cadastrados
app.get('/User', async (req, res) => {

    let getUsers = []

    if (req.query.email || req.query.name) {
        getUsers = await prisma.user.findMany({ // Sintaxe para buscar com query params: /User/?email=jlknqwj@gmail.com opcional: /User/?email=jlknqwj@gmail.com&&name=marco
            where: {
                email: req.query.email,
                name: req.query.name
            },
            select: {
                email: true,
                name: true // select informa quais os campos que ele pode retornar, omitindo os não informados, como o password
            }
        })
    } else {
        getUsers = await prisma.user.findMany({
            select: {
                email: true,
                name: true
            }
        })
    }

    res.status(200).json(getUsers);
})

// Criar usuário
app.post('/User', async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hashPassword
        }
    })
    res.status(201).json({ message: 'Usuário criado com sucesso' });
})

// Verifica o usuário (Login)
app.post('/User/Login', async (req, res) => {
    const verifyEmail = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (!verifyEmail) {
        return res.status(401).json('Email ou senha não encontrado') // usa-se 401 e a mesma mensagem para o atacante nao saber nem quais emails nem senhas que existem
    }

    const verifyCredentials = await bcrypt.compare(req.body.password, verifyEmail.password) // usa o verifyEmail.password para pegar a senha que ta junto da linha do email inserido
    if (verifyCredentials) {
        return res.status(200).json({ message: 'Sucess Login!' })
    } else {
        return res.status(401).json({ message: 'Email ou senha não encontrado' }) // usa-se 401 e a mesma mensagem para o atacante nao saber nem quais emails nem senhas que existem
    }

})

// Alterar dados dos usuários
app.put('/User/:id', async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hashPassword
        }
    })
    res.status(201).json({ message: 'Dados alterados com sucesso' });
})

// Deletar usuário (por completo)
app.delete('/User/:id', async (req, res) => {
    try {
        const result = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });

        if (!result) {
            return res.status(404).json({ message: 'erro, verifique o ID digitado e tente novamente!' })
        }
        res.status(204).end()

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: 'Internal Server Error! ' });
    }
})
