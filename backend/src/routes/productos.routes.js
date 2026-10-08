import {Router} from 'express';
import * as productosController from '../controllers/productos.controller.js';

// Router() es una mini-app de Express que agrupa rutas relacionadas; se
// monta en index.js bajo un prefijo (app.use('/productos', productosRouter)),
// así que acá adentro '/' en realidad significa '/productos'.
export const productosRouter = Router();

// Express revisa estas líneas en orden y usa la primera que matchee el
// método HTTP + la forma de la URL del pedido entrante.
productosRouter.get('/', productosController.listar);
productosRouter.post('/', productosController.crear);
productosRouter.get('/:id', productosController.obtenerUno);
productosRouter.put('/:id', productosController.actualizar);
productosRouter.delete('/:id', productosController.eliminar);