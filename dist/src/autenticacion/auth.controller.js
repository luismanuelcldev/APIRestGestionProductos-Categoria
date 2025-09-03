"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfil = exports.iniciarSesion = exports.registrar = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jwt_1 = require("./jwt");
const config_1 = require("../config/config");
const logger_1 = require("../config/logger");
const prisma = new client_1.PrismaClient();
// Registrar un nuevo usuario
const registrar = async (req, res) => {
    const { nombreUsuario, email, password, nombre, apellido } = req.body;
    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { nombreUsuario },
                    { email }
                ]
            }
        });
        if (usuarioExistente) {
            const campo = usuarioExistente.nombreUsuario === nombreUsuario ? 'nombreUsuario' : 'email';
            logger_1.logger.warn(`Intento de registro con ${campo} duplicado: ${campo === 'nombreUsuario' ? nombreUsuario : email} - IP: ${req.ip}`);
            res.status(400).json({ mensaje: `Ya existe un usuario con ese ${campo}` });
            return;
        }
        // Hash de la contraseña
        const passwordHash = await bcrypt_1.default.hash(password, config_1.config.rondas_salt_bcrypt);
        // Crear usuario
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombreUsuario,
                email,
                password: passwordHash,
                nombre,
                apellido,
                rol: 'USUARIO', // Por defecto, los usuarios son "USUARIO"
                fechaRegistro: new Date(),
                activo: true
            },
            select: {
                id: true,
                nombreUsuario: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                fechaRegistro: true
            }
        });
        logger_1.logger.info(`Nuevo usuario registrado: ${nombreUsuario} - IP: ${req.ip}`);
        // Generar token JWT para el usuario nuevo
        const token = (0, jwt_1.generarToken)({
            id: nuevoUsuario.id,
            nombreUsuario: nuevoUsuario.nombreUsuario,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol
        });
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: nuevoUsuario,
            token
        });
    }
    catch (error) {
        logger_1.logger.error(`Error al registrar usuario: ${error}`);
        res.status(500).json({
            mensaje: 'Error al registrar el usuario',
            error
        });
    }
};
exports.registrar = registrar;
// Iniciar sesión
const iniciarSesion = async (req, res) => {
    const { nombreUsuario, password } = req.body;
    try {
        // Buscar al usuario
        const usuario = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { nombreUsuario },
                    { email: nombreUsuario } // Permitir iniciar sesión con email también
                ],
                AND: {
                    activo: true
                }
            }
        });
        if (!usuario) {
            logger_1.logger.warn(`Intento de inicio de sesión fallido: Usuario no encontrado - ${nombreUsuario} - IP: ${req.ip}`);
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }
        // Verificar contraseña
        const passwordCorrecto = await bcrypt_1.default.compare(password, usuario.password);
        if (!passwordCorrecto) {
            logger_1.logger.warn(`Intento de inicio de sesión fallido: Contraseña incorrecta - ${nombreUsuario} - IP: ${req.ip}`);
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }
        // Actualizar último acceso
        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimoAcceso: new Date() }
        });
        // Generar token JWT
        const token = (0, jwt_1.generarToken)({
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            email: usuario.email,
            rol: usuario.rol
        });
        logger_1.logger.info(`Inicio de sesión exitoso: ${usuario.nombreUsuario} - IP: ${req.ip}`);
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                rol: usuario.rol
            },
            token
        });
    }
    catch (error) {
        logger_1.logger.error(`Error al iniciar sesión: ${error}`);
        res.status(500).json({
            mensaje: 'Error al iniciar sesión',
            error
        });
    }
};
exports.iniciarSesion = iniciarSesion;
// Perfil del usuario
const perfil = async (req, res) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuario.id },
            select: {
                id: true,
                nombreUsuario: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                fechaRegistro: true,
                ultimoAcceso: true
            }
        });
        if (!usuario) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }
        res.json({
            mensaje: 'Perfil de usuario',
            datos: usuario
        });
    }
    catch (error) {
        logger_1.logger.error(`Error al obtener perfil de usuario: ${error}`);
        res.status(500).json({
            mensaje: 'Error al obtener el perfil de usuario',
            error
        });
    }
};
exports.perfil = perfil;
