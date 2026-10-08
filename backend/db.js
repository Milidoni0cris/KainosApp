import {Pool} from 'pg'

// Pool mantiene varias conexiones abiertas a Postgres y las reparte entre
// los pedidos que vayan llegando, en vez de una sola conexión compartida
// (que haría cola si llegan varios pedidos al mismo tiempo).
//
// Los valores vienen de process.env (variables de entorno), cargadas desde
// backend/.env gracias a --env-file en el script "dev" de package.json.
// Nunca están escritos acá a mano, ni se suben a git (.env está en .gitignore).
export const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
})
