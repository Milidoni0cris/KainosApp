import * as preciosService from '../services/precios.service.js';

// req.params.id acá es el :id de productos, no uno propio de este router —
// existe gracias a mergeParams: true en precios.routes.js.

export async function listarPrecios(req, res, next) {
  try {
    const precios = await preciosService.listarPorProducto(req.params.id);
    res.json(precios);
  } catch (err) {
    next(err);
  }
}

export async function agregarPrecio(req, res, next) {
  try {
    const precio = await preciosService.agregar(req.params.id, req.body);
    res.status(201).json(precio);
  } catch (err) {
    next(err);
  }
}