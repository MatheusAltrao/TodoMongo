const express = require('express')
const dotenv = require('dotenv')

const connectToDatabase = require('./src/database/mongoose.database')
const TaskModel = require('./src/models/task.model')


dotenv.config()
const app = express()
//falando pro express que vamos receber json na body da requisicao
app.use(express.json())

connectToDatabase()

//async pois para buscar algo do banco pode demorar um tempo
app.get('/tasks', async (req, res) => {
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
app.get('/tasks/:id', async (req, res) => {
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
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new TaskModel(req.body)
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


//atualizando o iscompleted da task e não deixando atualizar a descrição
app.patch('/tasks/:id', async (req, res) => {
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
app.delete('/tasks/:id', async (req, res) => {
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



app.listen(8000, () => console.log('Listening on port 8000'))