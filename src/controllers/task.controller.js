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
}

module.exports = TaskController