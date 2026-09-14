import bcrypt from 'bcrypt';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import 'dotenv/config' // essa biblioteca permite usar dados sensíveis (dados de arquivo .env) no projeto.
import authMiddleware from '../Util/auth.middleware.js';
import roleMiddleware from '../Util/role.middleware.js';


const prisma = new PrismaClient();


// Buscar todos os usuários cadastrados
app.get('/User', async (req, res) => { // não precisa de ADMIN pois qualquer um pode acessar essa rota

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
app.post('/User', async (req, res) => { // não precisa de ADMIN pois é o própio cadastro do usuário
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hashPassword
            // role nao se poẽ pois por padrão (@dafault la no prisma) ele já vai em STANDARD
        }
    })
    res.status(201).json({ message: 'Usuário criado com sucesso' });
})

// Verifica o usuário (Login)
app.post('/User/Login', async (req, res) => { // não precisa ser ADMIN pois é o própio login do usuário
    const verifyEmail = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (!verifyEmail) {
        return res.status(401).json('Email ou senha não encontrado') // usa-se 401 e a mesma mensagem para o atacante nao saber nem quais emails nem senhas que existem
    }

    const verifyCredentials = await bcrypt.compare(req.body.password, verifyEmail.password) // usa o verifyEmail.password para pegar a senha que ta junto da linha do email inserido

    if (!verifyCredentials) {
        return res.status(401).json({ message: 'Email ou senha não encontrado' }) // usa-se 401 e a mesma mensagem para o atacante nao saber nem quais emails nem senhas que existem
    }

    // Gera o token — payload tem o id e email do usuário
    // O token expira em 8 horas
    const token = jwt.sign( //sign é a assinatura do meu token
        { id: verifyEmail.id, email: verifyEmail.email, role: verifyEmail.role },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );

    return res.status(200).json({
        message: "Success Login!",
        token,
        // user: {
        //     id: verifyEmail.id,
        //     name: verifyEmail.name,              essas linhas comentadas são opcionas, poderão ser ultilizadas para saber
        //     email: verifyEmail.email             quem acabou de fazer login, sem precisar fazer outra requisição imediatamente.
        // }                                      fica seu critério implementar ou não.
    })
})

// Alterar dados dos usuários
app.put('/User/:id', async (req, res) => { // Não precisa ser ADMIN pois ele mesmo pode esquecer senha ou algo assim

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

// Promover um usuário para ADMIN
app.patch('User/:id/role', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
    const { role } = req.body; // lembrando que essa requisição só vai funcionar se o usuário for admin pois a rota está usando roleMiddleware que já verifica isso.

    if ( role !== 'ADMIN' && role !== 'STANDARD' ) { // esse if está fazendo uma verificação à variável acima e não verificando se o usuario que está fazendo
        return res.status(400).json({ message: 'Erro ao alterar a role' }) // isso é admin ou não pois o própio roleMiddleware já faz isso.
    }

    const updateRole = await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            role: { role }
        }
    })

    return res.status(200).json({ message: 'Alterações realizadas com sucesso!' })
})

// Deletar usuário (por completo)
app.delete('/User/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
 // lembrando que não preciso varificar na própia rota de delete se o usuario que está fazendo isso é admin ou não pois o própio roleMiddleware já está fazendo isso.
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
