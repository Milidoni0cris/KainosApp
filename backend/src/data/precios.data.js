// cerrarVigente y crear reciben "client" (una conexión fija, no el pool
// compartido) porque el service las corre juntas dentro de una misma
// transaccion — las dos tienen que pasar por la misma sesión de Postgres.

// Cierra la fila de precio que estaba vigente para este producto+canal.
// GREATEST evita un caso borde: si esa fila se creó hoy mismo (dos cambios
// de precio el mismo día), "ayer" quedaría antes que su propio
// vigente_desde — GREATEST se queda con el mayor de los dos, así nunca
// cierra con una fecha anterior a cuando esa fila empezó.
export async function cerrarVigente(client, productoId, canalId) {
  await client.query(
    `UPDATE precio
     SET vigente_hasta = GREATEST(vigente_desde, CURRENT_DATE - 1)
     WHERE producto_id = $1 AND canal_id = $2 AND vigente_hasta IS NULL`,
    [productoId, canalId]
  );
}

export async function crear(client, { producto_id, canal_id, monto }) {
  const result = await client.query(
    'INSERT INTO precio (producto_id, canal_id, monto) VALUES ($1, $2, $3) RETURNING *',
    [producto_id, canal_id, monto]
  );
  return result.rows[0];
}

// Esta sí recibe el pool directo: es de solo lectura, no participa de
// ninguna transacción, así que no hace falta una conexión fija.
export async function obtenerPorProducto(pool, productoId) {
  const result = await pool.query(
    `SELECT pr.id, pr.monto, pr.vigente_desde, pr.vigente_hasta, c.nombre AS canal
     FROM precio pr
     JOIN canal c ON pr.canal_id = c.id
     WHERE pr.producto_id = $1
     ORDER BY c.nombre, pr.vigente_desde DESC`,
    [productoId]
  );
  return result.rows;
}
