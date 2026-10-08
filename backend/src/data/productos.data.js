import { pool } from '../../db.js';

export async function obtenerTodos() {
  const result = await pool.query(`
    SELECT p.id, p.nombre, p.tipo, p.activo, c.nombre AS categoria
    FROM producto p
    JOIN categoria c ON p.categoria_id = c.id
    WHERE p.activo = true
    ORDER BY p.id
  `);
  return result.rows;
}

export async function crear({ categoria_id, nombre, tipo }) {
  const result = await pool.query(
    'INSERT INTO producto (categoria_id, nombre, tipo) VALUES ($1, $2, $3) RETURNING *',
    [categoria_id, nombre, tipo]
  );
  return result.rows[0];
}
