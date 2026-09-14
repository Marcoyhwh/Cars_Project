import jwt from 'jsonwebtoken';

// toda rota que for protegida vai acessar esse middleware

const authMiddleware = (req, res, next) => {
    // O token vem no header assim: Authorization: Bearer eyJhbGc...
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não informado.' });
    }

    // Separa "Bearer" do token em si
    const [scheme, token] = authHeader?.split(' '); // // para ele pegar o token somente depois do espeaço da minha string Bearer, Ex: 'Bearer kdncsdkdsi.jwevewv'

    if (scheme !== 'Bearer' || !token) { // o schema vira o Bearer (antes do espaço) e o token é o token (depois do espaço)
        return res.status(401).json({ // se não for estritamente igual a 'Bearer' e tbm não haver token cai na mensage,
            message: 'Formato do token inválido.' // mas se for estritamente igual a Bearer e tiver token vai pro try e cath logo abaixo
        });
    }

    try {
        // Verifica se o token é válido e não expirou
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Coloca os dados do usuário na requisição para as rotas usarem
        req.user = decoded; // todo req.user da brand vai ter o token junto para poder fazer as alterações

        next(); // libera para a rota executar
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};


export default authMiddleware;