require('colors')
require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/error.Middleware')

const port = process.env.PORT || 5001

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tareas', require('./routes/tareas.routes'))
app.use('/api/users', require('./routes/usersRoutes'))
app.use(errorHandler)

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))
