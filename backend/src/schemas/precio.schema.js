import { z } from 'zod';

// monto.positive() ya cubre el viejo chequeo manual de "monto <= 0" que
// tenía precios.service.js — una razón menos para repetirlo en el service.
export const precioSchema = z.object({
  canal_id: z.number().int().positive(),
  monto: z.number().positive(),
});