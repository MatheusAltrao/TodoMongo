const express = require('express')
const router = express.Router()

const TaskModel = require('../models/task.model')


//async pois para buscar algo do banco pode demorar um tempo
router.get('/', async (req, res) => {
    //listando todas as tarefas
    try {
        const tasks = await TaskModel.find({})
        res.status(200).send(tasks)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

//recuperando uma tarefa deletada
router.get('/:id', async (req, res) => {
    const taskId = req.params.id
    const task = await TaskModel.findById(taskId)

    try {

        if (!task) {
            return res.status(500).send('Tarefa não encontrada')
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//vamos usar a request para enviar os dados para o banco e salvando
router.post('', async (req, res) => {
    try {
        const newTask = new TaskModel(req.body)
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//atualizando o iscompleted da task e não deixando atualizar a descrição
router.patch('/:id', async (req, res) => {
    try {
        const taskId = req.params.id
        const tasksData = req.body

        const taskToUpdate = await TaskModel.findById(taskId)

        const allowedUpdates = ['isCompleted'] // campo q pode ser atualizado
        const requestUpdates = Object.keys(tasksData) //pegando os campos q estão vindo do body em json

        //para cada campo do body verificar se os campos estão incluidos no tasktoupdate pode receber o novo valor
        for (update of requestUpdates) {
            if (allowedUpdates.includes(update)) {
                //seria o mesmo que tasktoUpadate.isCompleted = ao valor recebido vindo do update
                taskToUpdate[update] = tasksData[update]
            } else {
                return res.status(500).send('Um ou mais campos inseridos não são editaveis')
            }
        }

        await taskToUpdate.save()


        return res.status(200).send(taskToUpdate)
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

//vamos deletar uma tarefa e precisamos passar o id da tarefa no parametro da url
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id
        const taskToDelete = await TaskModel.findById(taskId)

        if (!taskToDelete) {
            return req.status(404).send('Essa tarefa não foi encontrada')
        }

        const deletedTask = await TaskModel.findByIdAndDelete(taskId)

        res.status(200).send(deletedTask)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


module.exports = router
