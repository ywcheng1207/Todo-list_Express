// routes/index.js
const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')

router.use('/',authenticator, home)
router.use('/todos',authenticator, todos)
router.use('/users', users)

module.exports = router