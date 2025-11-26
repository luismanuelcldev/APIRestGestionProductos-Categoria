import { Request } from 'express';

// Funciones para construir filtros dinámicos para Prisma
export const construirFiltrosProducto = (req: Request) => {
  const filtros: any = {};
  
  // Filtrar por nombre
  if (req.query.nombre) {
    filtros.nombre = {
      contains: req.query.nombre as string
    };
  }
  
  // Filtrar por rango de precio
  if (req.query.precioMin || req.query.precioMax) {
    filtros.precio = {};
    
    if (req.query.precioMin) {
      filtros.precio.gte = parseInt(req.query.precioMin as string);
    }
    
    if (req.query.precioMax) {
      filtros.precio.lte = parseInt(req.query.precioMax as string);
    }
  }
  
  // Filtrar por categoría
  if (req.query.categoriaId) {
    filtros.categoriaId = parseInt(req.query.categoriaId as string);
  }
  
  // Filtrar por stock disponible
  if (req.query.stockMin) {
    filtros.stock = {
      gte: parseInt(req.query.stockMin as string)
    };
  }
  
  return filtros;
};

export const construirFiltrosCategoria = (req: Request) => {
  const filtros: any = {};
  
  // Filtrar por nombre
  if (req.query.nombre) {
    filtros.nombre = {
      contains: req.query.nombre as string
    };
  }
  
  return filtros;
};
