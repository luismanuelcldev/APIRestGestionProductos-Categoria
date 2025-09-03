import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generarToken } from './jwt';
import { config } from '../config/config';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

// Registrar un nuevo usuario
export const registrar = async (req: Request, res: Response): Promise<void> => {
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
      logger.warn(`Intento de registro con ${campo} duplicado: ${campo === 'nombreUsuario' ? nombreUsuario : email} - IP: ${req.ip}`);
      res.status(400).json({ mensaje: `Ya existe un usuario con ese ${campo}` });
      return;
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, config.rondas_salt_bcrypt);

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

    logger.info(`Nuevo usuario registrado: ${nombreUsuario} - IP: ${req.ip}`);
    
    // Generar token JWT para el usuario nuevo
    const token = generarToken({
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
  } catch (error) {
    logger.error(`Error al registrar usuario: ${error}`);
    res.status(500).json({
      mensaje: 'Error al registrar el usuario',
      error
    });
  }
};

// Iniciar sesión
export const iniciarSesion = async (req: Request, res: Response): Promise<void> => {
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
      logger.warn(`Intento de inicio de sesión fallido: Usuario no encontrado - ${nombreUsuario} - IP: ${req.ip}`);
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    
    if (!passwordCorrecto) {
      logger.warn(`Intento de inicio de sesión fallido: Contraseña incorrecta - ${nombreUsuario} - IP: ${req.ip}`);
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    });

    // Generar token JWT
    const token = generarToken({
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol
    });

    logger.info(`Inicio de sesión exitoso: ${usuario.nombreUsuario} - IP: ${req.ip}`);
    
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
  } catch (error) {
    logger.error(`Error al iniciar sesión: ${error}`);
    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error
    });
  }
};

// Perfil del usuario
export const perfil = async (req: Request & { usuario?: any }, res: Response): Promise<void> => {
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
  } catch (error) {
    logger.error(`Error al obtener perfil de usuario: ${error}`);
    res.status(500).json({
      mensaje: 'Error al obtener el perfil de usuario',
      error
    });
  }
};
