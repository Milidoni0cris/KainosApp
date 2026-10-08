import * as productosService from '../services/productos.service.js';

export async function listar(req, res, next) {
  try {
    const productos = await productosService.listar();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
    try {
        const nuevoProducto = await productosService.crear(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        next(error);
    }
}