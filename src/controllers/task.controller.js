const mongoose = require('mongoose');
const { notAllowedFieldsToUpdate } = require('../errors/general.errors')
const { notFoundError, objectIdCastError } = require('../errors/mongodb.erros')
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

        try {
            const taskId = this.req.params.id;
            const task = await TaskModel.findById(taskId); // Mover para dentro do try

            if (!task) {
                return notFoundError(this.res);
            }
            this.res.status(200).send(task);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }
            this.res.status(500).send(error.message);
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

            if (!taskToUpdate) {
                return notFoundError(this.res)
            }

            const allowedUpdates = ['isCompleted'] // campo q pode ser atualizado
            const requestUpdates = Object.keys(tasksData) //pegando os campos q estão vindo do body em json

            //para cada campo do body verificar se os campos estão incluidos no tasktoupdate pode receber o novo valor
            for (const update of requestUpdates) {
                if (allowedUpdates.includes(update)) {
                    //seria o mesmo que tasktoUpadate.isCompleted = ao valor recebido vindo do update
                    taskToUpdate[update] = tasksData[update]
                } else {
                    return notAllowedFieldsToUpdate(this.res)
                }
            }

            await taskToUpdate.save()


            return this.res.status(200).send(taskToUpdate)
        } catch (error) {

            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }
            return this.res.status(500).send(error.message)
        }
    }

    async deleteTask() {
        try {
            const taskId = this.req.params.id
            const taskToDelete = await TaskModel.findById(taskId)

            if (!taskToDelete) {
                return notFoundError(this.res)
            }

            const deletedTask = await TaskModel.findByIdAndDelete(taskId)

            this.res.status(200).send(deletedTask)
        } catch (error) {

            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }
            this.res.status(500).send(error.message)
        }
    }
}

module.exports = TaskController