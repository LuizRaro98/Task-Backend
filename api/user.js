const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = async (req, res) => {
        const { name, email, password } = req.body;

        // Verifica se todos os campos estão preenchidos
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Verifica se o email já está cadastrado
        const existingUser = await app.db('users')
            .where('email', email.toLowerCase())
            .first();

        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado!' });
        }

        // Cria a hash da senha e salva o usuário
        obterHash(password, hash => {
            const hashedPassword = hash;

            app.db('users')
                .insert({ 
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword
                })
                .then(_ => res.status(204).send()) // Sucesso, sem corpo
                .catch(err => res.status(400).json({ error: 'Erro ao cadastrar usuário: ' + err.message }));
        });
    }

    return { save }
}
