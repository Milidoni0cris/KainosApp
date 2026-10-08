import { Router } from "express";
import * as preciosController from "../controllers/precios.controller.js";

// mergeParams: true deja que este router, aunque vive en su propio
// archivo, siga viendo los parámetros de la URL definidos en el router
// padre (productosRouter) donde se monta — sin esto, req.params.id
// quedaría undefined acá adentro.
export const preciosRouter = Router({ mergeParams: true });

// Rutas relativas a donde sea que productos.routes.js monte este router
// (hoy: /productos/:id/precios).
preciosRouter.get('/', preciosController.listarPrecios);
preciosRouter.post('/', preciosController.agregarPrecio);