"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// Variables de entorno y configuraciones
exports.config = {
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'clave-secreta-api-productos',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    // Servidor
    puerto: Number(process.env.PORT) || 3001,
    entorno: process.env.NODE_ENV || 'development',
    esProduccion: process.env.NODE_ENV === 'production',
    // Paginación
    paginacionPredeterminada: {
        limite: 10,
        pagina: 1,
        ordenarPor: 'id',
        ordenarDireccion: 'asc'
    },
    // Seguridad
    rondas_salt_bcrypt: 10
};
