import express from 'express'
import {pool} from './db.js'
import { productosRouter } from './src/routes/productos.routes.js'
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()
app.use(express.json())
app.use('/productos', productosRouter)

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Kainos backend funcionando')
})

app.get('/test-db', async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})


app.use(errorHandler)