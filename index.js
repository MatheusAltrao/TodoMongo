const express = require('express')
const dotenv = require('dotenv')

const connectToDatabase = require('./src/database/mongoose.database')
const TaskRouter = require('./src/routes/task.routes')

dotenv.config()
const app = express()

//falando pro express que vamos receber json na body da requisicao
app.use(express.json())
connectToDatabase()

app.use('/tasks', TaskRouter)



app.listen(8000, () => console.log('Listening on port 8000'))