import {Router} from 'express';
import * as productosController from '../controllers/productos.controller.js';

export const productosRouter = Router();

productosRouter.get('/', productosController.listar);
productosRouter.post('/', productosController.crear);