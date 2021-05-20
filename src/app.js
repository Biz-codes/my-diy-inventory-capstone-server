require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router')
const suppliesRouter = require('./supplies/supplies-router')
const toolsRouter = require('./tools/tools-router')
const projectsRouter = require('./projects/projects-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

app.use('/api/users', usersRouter)
app.use('/api/supplies', suppliesRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/projects', projectsRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// app.use(function errorHandler(error, req, res, next) {
//     let response
//     if (NODE_ENV === 'production') {
//     response = { error: { message: 'server error' } }
//     } else {
//       console.error(error)
//       response = { message: error.message, error }
//     }
//     res.status(500).json(response)
// })

module.exports = app