const moment = require('moment')

module.exports = app => {
    const getTasks = (req, res) => {
        app.db('tasks')
            .where({ userId: req.user.id })
            .orderBy('estimateAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }
    
    const save = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório');
        }
    
        req.body.userId = req.user.id;
    
        app.db('tasks')
            .insert(req.body)
            .returning('*') // Retorna a tarefa inserida
            .then(task => res.status(201).json(task[0])) // Retorna a tarefa criada
            .catch(err => res.status(400).json(err));
    };
    
    
    

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    const msg = `Task com id ${req.params.id} não encontrada.`;
                    return res.status(404).send(msg);
                }
    
                // Define doneAt como null ou a data atual
                const doneAt = task.doneAt ? null : new Date().toISOString();
                return updateTaskDoneAt(req, res, doneAt); // Chama a função para atualizar
            })
            .catch(err => res.status(400).json(err));
    };
    
    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .returning('*') // Retorna a tarefa atualizada
            .then(updatedTask => res.status(200).json(updatedTask[0])) // Retorna a tarefa atualizada
            .catch(err => res.status(400).json(err));
    };

    const update = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório');
        }

        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({
                desc: req.body.desc,
                estimateAt: req.body.estimateAt || null, // Atualiza estimateAt se fornecido
            })
            .returning('*') // Retorna a tarefa atualizada
            .then(updatedTask => {
                if (updatedTask.length > 0) {
                    res.status(200).json(updatedTask[0]); // Retorna a tarefa atualizada
                } else {
                    res.status(404).send(`Task com id ${req.params.id} não encontrada.`);
                }
            })
            .catch(err => res.status(400).json(err));
    };
    
    
    

    return { getTasks, save, remove, toggleTask, update }
}