import { pool } from '../../db.js';

// Esta es la única capa (data) que le habla directo a Postgres con
// pool.query(). Las capas de arriba (service, controller) nunca ven SQL.

export async function obtenerTodos() {
  const result = await pool.query(`
    SELECT p.id, p.nombre, p.tipo, p.activo, c.nombre AS categoria
    FROM producto p
    JOIN categoria c ON p.categoria_id = c.id
    WHERE p.activo = true
    ORDER BY p.id
  `);
  // result.rows es siempre un arreglo (0, 1 o muchas filas) — por eso acá
  // se devuelve tal cual, a diferencia de las funciones de abajo que buscan
  // una sola fila y agregan [0].
  return result.rows;
}

export async function crear({ categoria_id, nombre, tipo }) {
  const result = await pool.query(
    // $1, $2, $3 son consultas parametrizadas: pg reemplaza cada uno por el
    // valor correspondiente del arreglo de forma segura, nunca como texto
    // concatenado. Si se armara el SQL pegando strings con los valores de
    // entrada, alguien podría mandar un "nombre" diseñado para alterar la
    // consulta (inyección SQL) — con parámetros, eso no es posible.
    'INSERT INTO producto (categoria_id, nombre, tipo) VALUES ($1, $2, $3) RETURNING *',
    [categoria_id, nombre, tipo]
  );
  // RETURNING * le pide a Postgres la fila recién insertada (ya con el id
  // generado por la IDENTITY), sin tener que hacer un SELECT aparte.
  return result.rows[0];
}


export async function obtenerPorId(id) {
  const result = await pool.query(
    `SELECT p.id, p.nombre, p.tipo, p.activo, p.categoria_id, c.nombre AS categoria
     FROM producto p
     JOIN categoria c ON p.categoria_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  // Si no existe ese id, result.rows queda vacío y result.rows[0] es
  // undefined — la capa de service es quien decide qué hacer con eso
  // (tirar un 404), esta capa solo reporta lo que encontró.
  return result.rows[0];
}

export async function actualizar(id, { categoria_id, nombre, tipo }) {
  const result = await pool.query(
    'UPDATE producto SET categoria_id = $1, nombre = $2, tipo = $3 WHERE id = $4 RETURNING *',
    [categoria_id, nombre, tipo, id]
  );
  return result.rows[0];
}

// "Eliminar" un producto nunca borra la fila: la desactiva. El producto
// puede estar referenciado por precios, ventas o recetas ya existentes
// (borrado lógico, decisión 8 del CONTEXTO.md) — por eso esto es un
// UPDATE, no un DELETE de SQL.
export async function desactivar(id) {
  const result = await pool.query(
    'UPDATE producto SET activo = false WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}