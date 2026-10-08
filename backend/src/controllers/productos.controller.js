import * as productosService from '../services/productos.service.js';

// Esta capa traduce HTTP <-> negocio. No sabe nada de SQL (eso es de
// data/) y delega toda regla de negocio al service. Todos los handlers
// siguen el mismo esqueleto: 1) sacar datos de req, 2) llamar al service,
// 3) armar la respuesta con res — y si algo falla, next(err).

export async function listar(req, res, next) {
  try {
    const productos = await productosService.listar();
    res.json(productos);
  } catch (err) {
    // next(err) le dice a Express "saltá los middlewares normales que
    // siguen y mandá esto directo al manejador de errores" (el de 4
    // parámetros, registrado al final de index.js). Sin esto, un error
    // async que no se capture deja al cliente esperando una respuesta
    // que nunca llega.
    next(err);
  }
}

export async function crear(req, res, next) {
    try {
        // req.body es el JSON que mandó el cliente — requiere que
        // app.use(express.json()) esté activo en index.js.
        const nuevoProducto = await productosService.crear(req.body);
        res.status(201).json(nuevoProducto); // 201 = se creó un recurso nuevo
    } catch (err) {
        next(err);
    }
}

export async function obtenerUno(req, res, next) {
  try {
    // req.params son los valores tomados de la URL. Con la ruta '/:id',
    // GET /productos/7 deja req.params.id === '7' (llega como string,
    // no como número).
    const producto = await productosService.obtenerPorId(req.params.id);
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const producto = await productosService.actualizar(req.params.id, req.body);
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    await productosService.desactivar(req.params.id);
    res.status(204).send(); // 204 = éxito, sin contenido para devolver
  } catch (err) {
    next(err);
  }
}