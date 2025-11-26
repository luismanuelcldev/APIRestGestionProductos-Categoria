import express, { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import expressWinston from 'express-winston';

import productosRouter from './routes/productos.routes';
import categoriasRouter from './routes/categorias.routes';
import authRouter from './routes/auth.routes';
import swaggerSpec from './documentacion/swagger.config';
import { config } from './config/config';
import { logger } from './config/logger';

// Configuro la app
const app: Express = express();
const PORT: number = config.puerto;

// Configuro middlewares de seguridad y utilidades
app.use(helmet()); // Seguridad para headers HTTP
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Configuro middleware para logging con Winston
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: config.esProduccion ? false : true, // Mostrar metadatos en desarrollo
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}}ms',
  colorize: true
}));

// Configuro Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API REST de Productos y Categorías',
  customfavIcon: '',
  swaggerOptions: {
    filter: true,
    showExtensions: true,
    displayRequestDuration: true
  }
}));

// Defino endpoint para obtener la especificación de Swagger en formato JSON
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Defino la ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    mensaje: 'API de Productos y Categorías con Prisma',
    endpoints: {
      productos: '/api/productos',
      categorias: '/api/categorias',
      documentacion: '/api-docs'
    },
    estado: 'online',
    version: '1.0.0'
  });
});

// Defino las rutas de la API
app.use('/api', productosRouter);
app.use('/api', categoriasRouter);
app.use('/api', authRouter);

// Defino middleware para manejar rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada',
    ruta: req.url
  });
});

// Configuro middleware para logging de errores
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} - {{err.message}}'
}));

// Defino middleware para manejar errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error inesperado: ${err.message}`, { stack: err.stack });
  
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: config.esProduccion ? 'Ocurrió un error en el servidor' : err.message
  });
});

// Inicio el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
