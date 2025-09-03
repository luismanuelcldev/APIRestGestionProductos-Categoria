import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../config/logger';

// Interfaz para extender el objeto Request
export interface SolicitudConUsuario extends Request {
  usuario?: {
    id: number;
    nombreUsuario: string;
    email: string;
    rol: string;
  };
}

// Verificar token JWT y autenticar usuario
export const verificarToken = (req: SolicitudConUsuario, res: Response, next: NextFunction) => {
  // Obtener el token del header de autorización
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    logger.warn(`Acceso denegado: Token no proporcionado - IP: ${req.ip}`);
    return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    // Formato Bearer <token>
    const token = bearerHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.usuario = decoded as any;
    
    // Registrar acceso autorizado
    logger.debug(`Usuario ${req.usuario?.nombreUsuario} autenticado correctamente`);
    
    next();
  } catch (error) {
    logger.warn(`Token inválido - IP: ${req.ip}`);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Verificar rol de administrador
export const verificarAdmin = (req: SolicitudConUsuario, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }
  
  if (req.usuario.rol !== 'ADMINISTRADOR') {
    logger.warn(`Acceso denegado: Usuario ${req.usuario.nombreUsuario} sin privilegios de administrador - IP: ${req.ip}`);
    return res.status(403).json({ mensaje: 'Acceso denegado: No tienes permisos de administrador' });
  }
  
  next();
};

// Generar token JWT
export const generarToken = (usuario: { id: number, nombreUsuario: string, email: string, rol: string }) => {
  return jwt.sign(
    {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiration } as SignOptions
  );
};
