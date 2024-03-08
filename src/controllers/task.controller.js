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

    async createTask() {
        try {
            const newTask = new TaskModel(this.req.body)
            await newTask.save()
            this.res.status(201).send(newTask)
        } catch (error) {
            this.res.status(500).send(error.message)
        }
    }

    async updateTask() {
        try {
            const taskId = this.req.params.id
            const tasksData = this.req.body

            const taskToUpdate = await TaskModel.findById(taskId)

            const allowedUpdates = ['isCompleted'] // campo q pode ser atualizado
            const requestUpdates = Object.keys(tasksData) //pegando os campos q estão vindo do body em json

            //para cada campo do body verificar se os campos estão incluidos no tasktoupdate pode receber o novo valor
            for (const update of requestUpdates) {
                if (allowedUpdates.includes(update)) {
                    //seria o mesmo que tasktoUpadate.isCompleted = ao valor recebido vindo do update
                    taskToUpdate[update] = tasksData[update]
                } else {
                    return this.res.status(500).send('Um ou mais campos inseridos não são editaveis')
                }
            }

            await taskToUpdate.save()


            return this.res.status(200).send(taskToUpdate)
        } catch (error) {
            return this.res.status(500).send(error.message)
        }
    }

    async deleteTask() {
        try {
            const taskId = this.req.params.id
            const taskToDelete = await TaskModel.findById(taskId)

            if (!taskToDelete) {
                return this.req.status(404).send('Essa tarefa não foi encontrada')
            }

            const deletedTask = await TaskModel.findByIdAndDelete(taskId)

            this.res.status(200).send(deletedTask)
        } catch (error) {
            this.res.status(500).send(error.message)
        }
    }
}

module.exports = TaskController