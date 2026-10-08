import { z } from 'zod';

// Misma forma que exige la tabla producto, pero validada del lado de
// Node, antes de gastar un viaje a Postgres. z.enum(...) es el espejo
// del CHECK (tipo IN ('simple','promo')) de la base — dos capas que
// protegen lo mismo, por si algún día algo escribe en la tabla sin
// pasar por esta API.
export const productoSchema = z.object({
  categoria_id: z.number().int().positive(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío'),
  tipo: z.enum(['simple', 'promo']),
});
