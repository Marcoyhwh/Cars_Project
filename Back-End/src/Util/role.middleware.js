// Sempre roda DEPOIS do authMiddleware, porque depende de req.user já existir
const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) { // req.user é a variável decoded la do auth.Middleware, se ele nao existir nao ter sido criado ele ja para. Por isso esse arquivo só roda dps do auth.Middleware.
            // é uma segurança extra extra, se esse middleware rodar sem o authMiddleware antes,
            // para aqui em vez de deixar passar silenciosamente:
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Você não tem permissão para essa ação' }); // 403 é justamente para dizer que vc não tem permissão para isso realizar
        }

        next();
    };
};

export default roleMiddleware;