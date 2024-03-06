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

//vamos deletar uma tarefa e precisamos passar o id da tarefa no parametro da url

app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id
        const taskToDelete = await TaskModel.findById(taskId)

        if (!taskToDelete) {
            return req.status(500).send('Essa tarefa não foi encontrada')
        }

        const deletedTask = await TaskModel.findByIdAndDelete(taskId)

        res.status(200).send(deletedTask)
    } catch (error) {
        res.status(500).send(error.message)
    }
})



app.listen(8000, () => console.log('Listening on port 8000'))