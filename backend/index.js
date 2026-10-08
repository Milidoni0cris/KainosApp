import express from 'express'
import {pool} from './db.js'
import { productosRouter } from './src/routes/productos.routes.js'
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()

// Sin esto, req.body queda undefined en un POST/PUT: Express no interpreta
// el JSON que llega en el pedido a menos que se lo digas explícitamente.
app.use(express.json())

// Monta todas las rutas de productosRouter bajo el prefijo /productos.
// Adentro de ese router, '/' en realidad significa '/productos'.
app.use('/productos', productosRouter)

// process.env.PORT permite que un hosting (Render, Railway, etc.) le
// asigne a la app el puerto que quiera; en tu máquina no está seteada,
// así que cae en el valor de respaldo, 3000.
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Kainos backend funcionando')
})

// Ruta de prueba para confirmar que Node puede hablarle a Postgres.
app.get('/test-db', async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
});



// Prende el servidor y lo deja escuchando en PORT. El callback corre una
// sola vez, apenas arranca.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})


// Middleware de 4 parámetros = manejador de errores para Express. Solo se
// ejecuta cuando algo llama a next(err) en cualquier ruta. Funciona acá
// aunque esté después de app.listen() porque todo este archivo corre una
// sola vez, de arriba a abajo, antes de que llegue ningún pedido real.
app.use(errorHandler)