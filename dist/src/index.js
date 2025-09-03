"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_winston_1 = __importDefault(require("express-winston"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const swagger_config_1 = __importDefault(require("./documentacion/swagger.config"));
const config_1 = require("./config/config");
const logger_1 = require("./config/logger");
// Configuración de la app
const app = (0, express_1.default)();
const PORT = config_1.config.puerto;
// Middlewares de seguridad y utilidades
app.use((0, helmet_1.default)()); // Seguridad para headers HTTP
app.use((0, cors_1.default)()); // Habilitar CORS
app.use(express_1.default.json()); // Parsear JSON en las solicitudes
app.use(express_1.default.urlencoded({ extended: true })); // Parsear URL-encoded
// Middleware para logging con Winston
app.use(express_winston_1.default.logger({
    winstonInstance: logger_1.logger,
    meta: config_1.config.esProduccion ? false : true, // Mostrar metadatos en desarrollo
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}}ms',
    colorize: true
}));
// Configuración de Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API REST de Productos y Categorías',
    customfavIcon: '',
    swaggerOptions: {
        filter: true,
        showExtensions: true,
        displayRequestDuration: true
    }
}));
// Endpoint para obtener la especificación de Swagger en formato JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_config_1.default);
});
// Ruta raíz
app.get('/', (req, res) => {
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
// Rutas de API
app.use('/api', productos_routes_1.default);
app.use('/api', categorias_routes_1.default);
app.use('/api', auth_routes_1.default);
// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada',
        ruta: req.url
    });
});
// Middleware para logging de errores
app.use(express_winston_1.default.errorLogger({
    winstonInstance: logger_1.logger,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} - {{err.message}}'
}));
// Middleware para manejar errores
app.use((err, req, res, next) => {
    logger_1.logger.error(`Error inesperado: ${err.message}`, { stack: err.stack });
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: config_1.config.esProduccion ? 'Ocurrió un error en el servidor' : err.message
    });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
