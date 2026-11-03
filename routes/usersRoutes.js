const express = require('express')
const router = express.Router()
const { crearUser, loginUser, datosUser } = require('../controllers/usersController.js')
const { protect } = require('../middleware/authMiddleware.js')

//endpoints publicos
router.post('/register', crearUser)
router.post('/login', loginUser)

//endpoint privado
router.get('/datos', protect, datosUser)

module.exports = router