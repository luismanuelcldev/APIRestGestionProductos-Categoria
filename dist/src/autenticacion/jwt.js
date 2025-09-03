"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarToken = exports.verificarAdmin = exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const logger_1 = require("../config/logger");
// Verificar token JWT y autenticar usuario
const verificarToken = (req, res, next) => {
    // Obtener el token del header de autorización
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        logger_1.logger.warn(`Acceso denegado: Token no proporcionado - IP: ${req.ip}`);
        return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
    }
    try {
        // Formato Bearer <token>
        const token = bearerHeader.split(' ')[1];
        // Verificar token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.usuario = decoded;
        // Registrar acceso autorizado
        logger_1.logger.debug(`Usuario ${req.usuario?.nombreUsuario} autenticado correctamente`);
        next();
    }
    catch (error) {
        logger_1.logger.warn(`Token inválido - IP: ${req.ip}`);
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};
exports.verificarToken = verificarToken;
// Verificar rol de administrador
const verificarAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }
    if (req.usuario.rol !== 'ADMINISTRADOR') {
        logger_1.logger.warn(`Acceso denegado: Usuario ${req.usuario.nombreUsuario} sin privilegios de administrador - IP: ${req.ip}`);
        return res.status(403).json({ mensaje: 'Acceso denegado: No tienes permisos de administrador' });
    }
    next();
};
exports.verificarAdmin = verificarAdmin;
// Generar token JWT
const generarToken = (usuario) => {
    return jsonwebtoken_1.default.sign({
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        email: usuario.email,
        rol: usuario.rol
    }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiration });
};
exports.generarToken = generarToken;
