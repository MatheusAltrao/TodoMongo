const { Schema, model } = require('mongoose')


//criando a entidade task e tambm o schema passando os tipos e os nomes dos campos
const TaskSchema = Schema({
    description: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const TaskModel = model('Task', TaskSchema)

module.exports = TaskModel

