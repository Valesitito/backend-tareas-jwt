# Backend de tareas con JWT

Este es el backend que hicimos en la clase de Ingeniería de Software. Es una API REST hecha con Node.js, Express y MongoDB (con Mongoose) donde te puedes registrar, iniciar sesión y manejar una lista de tareas.

Al hacer login la API regresa un token JWT, y ese token se tiene que mandar en el header `Authorization: Bearer <token>` para poder usar las rutas de tareas. Cada usuario solo puede ver, modificar y borrar sus propias tareas.

## Qué necesitas

- Node.js 18 o más nuevo
- Una base de datos de MongoDB (puede ser local o un cluster de MongoDB Atlas)

## Instalación

```bash
git clone https://github.com/Valesitito/backend-tareas-jwt.git
cd backend-tareas-jwt
npm install
```

Después hay que crear un archivo `.env` en la raíz, copiando `.env.example` y llenando los valores:

```env
PORT=5001
MONGO_DB=mongodb://127.0.0.1:27017/tareas
JWT_SECRET=una_clave_larga_y_secreta
NODE_ENV=development
```

El `.env` no se sube al repo (está en el `.gitignore`), por eso solo está el `.env.example` sin valores.

## Cómo correrlo

```bash
npm run dev    # se reinicia solo cuando guardas cambios
npm start      # normal
```

Si todo sale bien en la terminal aparece `Servidor iniciado en el puerto 5001` y `MongoDB Connected`. La API queda en `http://localhost:5001`.

## Endpoints

### Usuarios (`/api/users`)

| Método | Ruta | Qué hace | Token |
|--------|------|----------|-------|
| POST | `/api/users` | Registra un usuario (nombre, email, password) | No |
| POST | `/api/users/login` | Inicia sesión y regresa el JWT | No |
| GET | `/api/users/datos` | Regresa los datos del usuario dueño del token | Sí |

### Tareas (`/api/tareas`)

Todas pasan por el middleware `protect`.

| Método | Ruta | Qué hace | Token |
|--------|------|----------|-------|
| GET | `/api/tareas` | Lista solo las tareas del usuario logueado | Sí |
| POST | `/api/tareas` | Crea una tarea (`descripcion`) para el usuario logueado | Sí |
| PUT | `/api/tareas/:id` | Modifica una tarea propia | Sí |
| DELETE | `/api/tareas/:id` | Elimina una tarea propia | Sí |

Ejemplo del header:

```
GET http://localhost:5001/api/tareas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Cómo funciona la seguridad

- Las contraseñas se guardan con hash (bcrypt) y nunca se regresan en las respuestas.
- El middleware `protect` (en `middleware/authMiddleware.js`) revisa el header `Authorization`. Si no hay token o el token no es válido responde **401**.
- El id del usuario se saca del token (`req.user.id`), nunca del body ni de la URL.
- Cada tarea guarda el id de su dueño en el campo `user` y las consultas filtran por ese id. Si alguien quiere modificar o borrar una tarea que no es suya, la API responde **403** y la tarea no cambia.
- Si te registras con un correo que ya existe responde 400, y si el login es incorrecto responde 401.

## Estructura

```
config/db.js                      conexión a MongoDB
controllers/usersController.js    registro, login y datos del usuario
controllers/tarea.Controllers.js  CRUD de tareas
middleware/authMiddleware.js      middleware protect (valida el JWT)
middleware/error.Middleware.js    manejo de errores
models/user.Models.js             modelo de usuario
models/tareaModels.js             modelo de tarea
routes/usersRoutes.js             rutas de /api/users
routes/tareas.routes.js           rutas de /api/tareas
server.js                         arranque del servidor
```

Jorge Carlos Vales Martínez - Ingeniería de Software
