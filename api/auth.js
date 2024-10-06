const authSecret = process.env.AUTH_SECRET; // Acesse a variável de ambiente diretamente
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first();

        if (user) {
            try {
                const isMatch = await new Promise((resolve, reject) => {
                    bcrypt.compare(req.body.password, user.password, (err, match) => {
                        if (err) return reject(err);
                        resolve(match);
                    });
                });

                if (!isMatch) {
                    return res.status(401).json({ error: 'A senha informada é inválida!' });
                }

                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };

                return res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret),
                });
            } catch (err) {
                return res.status(500).json({ error: 'Erro ao verificar a senha.' });
            }
        } else {
            return res.status(400).json({ error: 'Usuário não cadastrado!' });
        }
    };

    return { signin };

};

