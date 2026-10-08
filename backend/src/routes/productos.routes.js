import {Router} from 'express';
import * as productosController from '../controllers/productos.controller.js';
import { preciosRouter } from './precios.routes.js';
import { validate } from '../middleware/validate.js';
import { productoSchema } from '../schemas/producto.schema.js';


// Router() es una mini-app de Express que agrupa rutas relacionadas; se
// monta en index.js bajo un prefijo (app.use('/productos', productosRouter)),
// así que acá adentro '/' en realidad significa '/productos'.
export const productosRouter = Router();

// Express revisa estas líneas en orden y usa la primera que matchee el
// método HTTP + la forma de la URL del pedido entrante.
productosRouter.get('/', productosController.listar);
// validate(productoSchema) corre ANTES que el controller: si req.body no
// cumple el schema, corta ahí con un 400 y crear/actualizar ni se llaman.
productosRouter.post('/', validate(productoSchema), productosController.crear);
productosRouter.get('/:id', productosController.obtenerUno);
productosRouter.put('/:id', validate(productoSchema), productosController.actualizar);
productosRouter.delete('/:id', productosController.eliminar);

// Monta preciosRouter como sub-router, colgado del :id de un producto
// puntual. El prefijo '/productos' solo existe acá (vía index.js), nunca
// hardcodeado adentro de precios.routes.js.
productosRouter.use('/:id/precios', preciosRouter);