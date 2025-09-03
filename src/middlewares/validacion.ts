import { Request, Response, NextFunction } from 'express';

// Middleware para validar el cuerpo de las solicitudes
export const validarCuerpo = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud está vacío' });
  }
  next();
};

// Middleware para validar que los campos obligatorios estén presentes para productos
export const validarProducto = (req: Request, res: Response, next: NextFunction) => {
  const { nombre, precio, categoriaId } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
  }

  if (precio !== undefined && (typeof precio !== 'number' || precio < 0)) {
    return res.status(400).json({ mensaje: 'El precio debe ser un número positivo' });
  }

  if (!categoriaId) {
    return res.status(400).json({ mensaje: 'El campo categoriaId es obligatorio' });
  }

  next();
};

// Middleware para validar que los campos obligatorios estén presentes para categorías
export const validarCategoria = (req: Request, res: Response, next: NextFunction) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
  }

  next();
};
