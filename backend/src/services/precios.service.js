import { pool } from '../../db.js';
import * as precioData from '../data/precios.data.js';
import * as productosService from './productos.service.js';
import { AppError } from '../utils/AppError.js';

export async function listarPorProducto(productoId) {
  await productosService.obtenerPorId(productoId); // 404 si el producto no existe
  return precioData.obtenerPorProducto(pool, productoId);
}

export async function agregar(productoId, datos) {
  await productosService.obtenerPorId(productoId);
  if (!datos.canal_id || !datos.monto) {
    throw new AppError('Faltan campos obligatorios (canal_id, monto)', 400);
  }
  if (datos.monto <= 0) {
    throw new AppError('El monto tiene que ser mayor a cero', 400);
  }

  // pool.connect() reserva UNA conexión fija y exclusiva (a diferencia de
  // pool.query(), que presta cualquier conexión libre y la devuelve en el
  // momento) — necesario para que BEGIN/los dos queries/COMMIT corran
  // todos en la misma sesión de Postgres, como una sola unidad atómica.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await precioData.cerrarVigente(client, productoId, datos.canal_id);
    const nuevoPrecio = await precioData.crear(client, {
      producto_id: productoId,
      canal_id: datos.canal_id,
      monto: datos.monto,
    });
    await client.query('COMMIT'); // confirma las dos operaciones juntas
    return nuevoPrecio;
  } catch (err) {
    // si algo falló, deshace cualquier cambio a medio hacer de esta
    // transacción (nunca queda un precio cerrado sin uno nuevo que lo
    // reemplace)
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // pase lo que pase, la conexión vuelve al pool — si te olvidás esto,
    // el pool se va quedando sin conexiones disponibles de a poco
    client.release();
  }
}