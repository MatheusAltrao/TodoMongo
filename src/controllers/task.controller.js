const TaskModel = require('../models/task.model')

class TaskController {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    async getTasks() {
        //listando todas as tarefas
        try {
            const tasks = await TaskModel.find({})
            this.res.status(200).send(tasks)
        } catch (error) {
            console.log(error)
            this.res.status(500).send(error.message)
        }
    }

    async getTasksById() {
        const taskId = this.req.params.id
        const task = await TaskModel.findById(taskId)

        try {
            if (!task) {
                return this.res.status(500).send('Tarefa não encontrada')
            }
            this.res.status(200).send(task)
        } catch (error) {
            this.res.status(500).send(error.message)
        }
    }
}

module.exports = TaskController