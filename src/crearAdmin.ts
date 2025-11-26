import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { config } from './config/config';
import { logger } from './config/logger';

const prisma = new PrismaClient();

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
      logger.info('Ya existe un usuario administrador en el sistema');
      return;
    }

    // Datos del administrador
    const admin = {
      nombreUsuario: 'admin',
      email: 'admin@ejemplo.com',
      password: await bcrypt.hash('admin123', config.rondas_salt_bcrypt),
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'ADMINISTRADOR' as const,
      fechaRegistro: new Date(),
      activo: true
    };

    // Crear el administrador
    const nuevoAdmin = await prisma.usuario.create({
      data: admin
    });

    logger.info(`Usuario administrador creado con ID: ${nuevoAdmin.id}`);
    logger.info('Credenciales: admin / admin123');
    logger.warn('¡Cambie la contraseña inmediatamente después del primer inicio de sesión!');
  } catch (error) {
    logger.error('Error al crear el usuario administrador:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
crearAdministrador();
