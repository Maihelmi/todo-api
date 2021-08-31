const express = require('express')
const userRouter = require('./router/user')
const todoRouter = require('./router/todo')


require('./db/mongoose')

const app = express()

app.use(express.json())


app.use(userRouter)
app.use(todoRouter)

const port = 3000


app.listen(port,()=>{console.log('Server is running')})
