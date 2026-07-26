import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/User', async (req, res) => {

    let getUsers = []

    if(req.query) {
        getUsers = await prisma.user.findMany({ // Sintaxe para buscar com query params: /User/?email=jlknqwj@gmail.com opcional: /User/?email=jlknqwj@gmail.com&&name=marco
            where: {
                id: req.query.id,
                email: req.query.email,
                name: req.query.name
            }
        })
    } else {
        getUsers = await prisma.user.findMany()
    }

    res.status(200).json(getUsers);

    
})


app.post('/User', async (req, res) => {
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }
    })
    res.status(201).json(req.body);
})


app.put('/User/:id', async (req, res) => {
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }
    })
    res.status(201).json(req.body);
})


app.delete('/User/:id', async (req, res) => {
    const getUsers = await prisma.user.findMany()
    try {
        const result = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'erro, verifique o ID digitado e tente novamente!' })
        }
        res.status(204).json({ message: 'Usuário deletado com sucesso' })

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: 'Internal Server Error! ' });
    }
})
