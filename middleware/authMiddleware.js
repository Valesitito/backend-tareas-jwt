const jwt = require('jsonwebtoken')
const User = require('../models/user.Models.js')
const asyncHandler = require('express-async-handler') // maneja errores de manera asincrona

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // obtenemos el token del header
            token = req.headers.authorization.split(' ')[1] // split(' ')[1] significa que separamos el string por espacios y tomamos el segundo elemento del array, que es el token
            // verificamos el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // obtenemos el usuario del token y lo agregamos a la request
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Acceso no autorizado, token no valido')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Acceso no autorizado, no se proporciono un token')
    }
})

module.exports = { protect }
