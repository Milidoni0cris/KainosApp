// Express reconoce un middleware con EXACTAMENTE estos 4 parámetros
// (err, req, res, next) como manejador de errores. Solo se ejecuta cuando
// algo en el camino llamó a next(err) — nunca en un pedido normal.
export function errorHandler(err, req, res, next) {
    // Si el error es un AppError (lo lanzamos nosotros a propósito, con un
    // statusCode elegido), se usa ese código; si es un error inesperado
    // (uno que no vimos venir, sin statusCode), cae en 500 por defecto.
    const statusCode = err.statusCode || 500;
    console.log(err);
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
}