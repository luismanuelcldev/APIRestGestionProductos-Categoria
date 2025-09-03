"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("./config");
// Configuración para el sistema de logging
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''}`;
}));
// Diferentes niveles para desarrollo y producción
const logLevel = config_1.config.esProduccion ? 'info' : 'debug';
// Crear el logger de Winston
exports.logger = winston_1.default.createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: { servicio: 'api-productos' },
    transports: [
        // Siempre registrar en la consola
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), logFormat)
        }),
        // Registrar todo en un archivo general
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
        // Registrar solo errores en un archivo específico
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});
// Agregar un nivel personalizado para eventos de seguridad
winston_1.default.addColors({ security: 'magenta' });
exports.logger.levels.security = 4; // Entre warning e info
