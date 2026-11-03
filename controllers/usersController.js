const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler') // maneja errores de manera asincrona
const User = require('../models/user.Models.js')

const crearUser = asyncHandler(async (req, res) => {
    // desestructuramos el body de la request
    const { nombre, email, password } = req.body

    // validamos que los campos no esten vacios
    if (!nombre || !email || !password) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    // verificamos que el usuario no exista
    const userExiste = await User.findOne({ email })
    if (userExiste) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    }

    // Hacemos el hash al password para guardarlo en la base de datos de manera segura
    const salt = await bcrypt.genSalt(10) // salt es un string aleatorio que se agrega a la contraseña antes de hashearla para hacerla mas segura
    const hashedPassword = await bcrypt.hash(password, salt)

    // Creamos el usuario
    const user = await User.create({
        nombre,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            password: user.password,
            token: generarToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('No se pudieron guardar los datos del usuario')
    }

})

const loginUser = asyncHandler(async (req, res) => {
    //desestructuramos el body de la request
    const { email, password } = req.body

    // verificamos que el usuario exista
    const user = await User.findOne({ email })

    // verificamos que la contraseña sea correcta 
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({ // res.status(200) significa que la request fue exitosa
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            password: user.password,
            token: generarToken(user.id)
        })
    } else {
        res.status(403) // 403 significa que el usuario no tiene permisos para acceder a ese recurso
        throw new Error('Credenciales Incorrectas')
    }

})

const datosUser = asyncHandler(async (req, res) => {
    
    res.status(200).json(req.user) // req.user es el usuario que se encuentra en el token

})

const generarToken = (id_usuario) => {
    return jwt.sign({ id: id_usuario }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = { crearUser, loginUser, datosUser }