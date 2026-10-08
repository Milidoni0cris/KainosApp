import { AppError } from "../utils/AppError.js";

// Middleware factory: no es un middleware en sí, es una función que
// DEVUELVE uno, ya configurado con el schema que le pasaste. Por eso en
// las rutas se usa como validate(productoSchema), no validate solo —
// necesita ejecutarse una vez para darte la función real que Express va
// a llamar en cada pedido.
export function validate(schema) {
  return (req, res, next) => {
    // safeParse nunca tira una excepción: devuelve { success, data } o
    // { success: false, error }, a diferencia de schema.parse(), que
    // explota si el dato no cumple. Así se puede manejar el caso de
    // error acá mismo, sin try/catch.
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // result.error.issues es un arreglo: puede fallar más de un campo
      // a la vez, se juntan todos los mensajes en uno solo.
      const mensaje = result.error.issues.map((i) => i.message).join(', ');
      return next(new AppError(mensaje, 400));
    }
    // req.body pasa a ser la versión validada por zod (y potencialmente
    // transformada, si el schema hiciera coerción) — lo que llega al
    // controller de acá en más ya es confiable.
    req.body = result.data;
    next();
  };
}