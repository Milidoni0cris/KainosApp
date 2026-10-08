import * as productosData from '../data/productos.data.js';
import { AppError } from '../utils/AppError.js';

export async function listar() {
    return productosData.obtenerTodos();
}

export async function crear(datos) {
    if (!datos.categoria_id || !datos.nombre || !datos.tipo) {
        throw new AppError('Faltan datos obligatorios', 400);
    }
    return productosData.crear(datos);
}