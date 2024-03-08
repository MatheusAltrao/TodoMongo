const express = require('express')
const router = express.Router()


const TaskController = require('../controllers/task.controller')

//async pois para buscar algo do banco pode demorar um tempo
router.get('/', async (req, res) => {
    return new TaskController(req, res).getTasks()
})

//recuperando uma tarefa deletada
router.get('/:id', async (req, res) => {
    return new TaskController(req, res).getTasksById()
})

//vamos usar a request para enviar os dados para o banco e salvando
router.post('', async (req, res) => {
    return new TaskController(req, res).createTask()
})

//atualizando o iscompleted da task e não deixando atualizar a descrição
router.patch('/:id', async (req, res) => {
    return new TaskController(req, res).updateTask()
})

//vamos deletar uma tarefa e precisamos passar o id da tarefa no parametro da url
router.delete('/:id', async (req, res) => {
    return new TaskController(req, res).deleteTask()
})


module.exports = router
