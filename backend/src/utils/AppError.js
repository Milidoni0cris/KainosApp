// Extiende la clase Error nativa de JS, sumándole un statusCode propio.
// Así, cuando algo en services/ hace "throw new AppError('...', 404)",
// ese 404 viaja pegado al error hasta el errorHandler, que lo lee para
// saber qué código HTTP responder (en vez de asumir siempre 500).
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // le pasa el mensaje a Error, que es quien lo guarda en .message
        this.statusCode = statusCode;
    }
}