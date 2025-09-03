"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config/config");
const logger_1 = require("./config/logger");
const prisma = new client_1.PrismaClient();
// Crear un usuario administrador inicial
async function crearAdministrador() {
    try {
        // Verificar si ya existe un administrador
        const adminExistente = await prisma.usuario.findFirst({
            where: {
                rol: 'ADMINISTRADOR'
            }
        });
        if (adminExistente) {
            logger_1.logger.info('Ya existe un usuario administrador en el sistema');
            return;
        }
        // Datos del administrador
        const admin = {
            nombreUsuario: 'admin',
            email: 'admin@ejemplo.com',
            password: await bcrypt_1.default.hash('admin123', config_1.config.rondas_salt_bcrypt),
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'ADMINISTRADOR',
            fechaRegistro: new Date(),
            activo: true
        };
        // Crear el administrador
        const nuevoAdmin = await prisma.usuario.create({
            data: admin
        });
        logger_1.logger.info(`Usuario administrador creado con ID: ${nuevoAdmin.id}`);
        logger_1.logger.info('Credenciales: admin / admin123');
        logger_1.logger.warn('¡Cambie la contraseña inmediatamente después del primer inicio de sesión!');
    }
    catch (error) {
        logger_1.logger.error('Error al crear el usuario administrador:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
// Ejecutar la función
crearAdministrador();
