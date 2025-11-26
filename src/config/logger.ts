import winston from 'winston';
import { config } from './config';

// Configuración para el sistema de logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''}`;
  })
);

// Adaptado a diferentes niveles para desarrollo y produccionn
const logLevel = config.esProduccion ? 'info' : 'debug';

// Crear el logger de Winston
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { servicio: 'api-productos' },
  transports: [
    // Siempre registrar en la consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    
    // Registrar todo en un archivo general
    new winston.transports.File({ filename: 'logs/combined.log' }),
    
    // Registrar solo errores en un archivo específico
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
});

// Agregar un nivel personalizado para eventos de seguridad
winston.addColors({ security: 'magenta' });
logger.levels.security = 4; 
