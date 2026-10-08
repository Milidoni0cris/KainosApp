import * as productosData from '../data/productos.data.js';
import { AppError } from '../utils/AppError.js';

// Acá vive la lógica de negocio: reglas y validaciones. Nunca SQL (eso es
// de data/) ni nada de req/res (eso es de controllers/).

export async function listar() {
    return productosData.obtenerTodos();
}

export async function crear(datos) {
    return productosData.crear(datos);
}

// "Guardia" reutilizable: centraliza el chequeo de existencia en un solo
// lugar. actualizar() y desactivar() la llaman primero, así ninguna de
// las dos repite esta misma verificación por su cuenta.
export async function obtenerPorId(id) {
    const producto = await productosData.obtenerPorId(id);
    if (!producto) {
        throw new AppError('Producto no encontrado', 404);
    }
    return producto;
}

export async function actualizar(id, datos) {
  await obtenerPorId(id); // tira 404 acá mismo si el id no existe
  return productosData.actualizar(id, datos);
}

export async function desactivar(id) {
  await obtenerPorId(id);
  return productosData.desactivar(id);
}