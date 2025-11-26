import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { obtenerOpcionesPaginacion, generarMetadatosPaginacion } from '../utils/paginacion';
import { construirFiltrosCategoria } from '../utils/filtros';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

// Obtener todas las categorías
export const obtenerCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener opciones de paginación
    const opcionesPaginacion = obtenerOpcionesPaginacion(req);
    
    // Construir filtros
    const filtros = construirFiltrosCategoria(req);
    
    // Contar total de registros para paginación
    const totalCategorias = await prisma.categoria.count({
      where: filtros
    });
    
    // Obtener categorías con paginación y filtros
    const categorias = await prisma.categoria.findMany({
      where: filtros,
      skip: opcionesPaginacion.skip,
      take: opcionesPaginacion.take,
      orderBy: {
        [opcionesPaginacion.ordenarPor]: opcionesPaginacion.ordenarDireccion
      }
    });
    
    // Generar metadatos de paginación
    const metadatosPaginacion = generarMetadatosPaginacion(totalCategorias, opcionesPaginacion);
    
    logger.debug(`Consulta de categorías con ${filtros ? Object.keys(filtros).length : 0} filtros - Página ${opcionesPaginacion.pagina}`);
    
    res.json({
      mensaje: 'Categorías obtenidas correctamente',
      datos: categorias,
      paginacion: metadatosPaginacion
    });
  } catch (error) {
    logger.error(`Error al obtener categorías: ${error}`);
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error });
  }
};

// Obtener una categoría específica por ID
export const obtenerCategoriaPorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: Number(id) },
      include: {
        productos: true
      }
    });
    
    if (!categoria) {
      res.status(404).json({ mensaje: `No se encontró categoría con ID: ${id}` });
      return;
    }
    
    res.json({
      mensaje: 'Categoría obtenida correctamente',
      datos: categoria
    });
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error });
  }
};

// Crear una nueva categoría
export const crearCategoria = async (req: Request, res: Response): Promise<void> => {
  const { nombre } = req.body;
  
  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre
      }
    });
    
    res.status(201).json({
      mensaje: 'Categoria creada correctamente',
      datos: nuevaCategoria
    });
  } catch (error: any) {
    console.error('Error al crear categoria:', error);
    
    // Capturar error de unicidad para nombre de categoría
    if (error.code === 'P2002') {
      res.status(400).json({ 
        mensaje: 'Ya existe una categoría con ese nombre',
        campo: error.meta?.target[0] || 'nombre'
      });
      return;
    }
    
    res.status(500).json({ mensaje: 'Error al crear la categoría', error });
  }
};

// Actualizar una categoría existente
export const actualizarCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  try {
    // Verificar si la categoría existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: Number(id) }
    });

    if (!categoriaExistente) {
      res.status(404).json({ mensaje: `No se encontró categoría con ID: ${id}` });
      return;
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: Number(id) },
      data: {
        nombre
      }
    });
    
    res.json({
      mensaje: 'Categoria actualizada correctamente',
      datos: categoriaActualizada
    });
  } catch (error: any) {
    console.error(`Error al actualizar categoria con ID ${id}:`, error);

    // Capturar error de unicidad para nombre de categoría
    if (error.code === 'P2002') {
      res.status(400).json({
        mensaje: 'Ya existe otra categoria con ese nombre',
        campo: error.meta?.target[0] || 'nombre'
      });
      return;
    }
    
    res.status(500).json({ mensaje: 'Error al actualizar la categoría', error });
  }
};

// Eliminar una categoría
export const eliminarCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    // Verificar si la categoría existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: Number(id) },
      include: {
        productos: true
      }
    });

    if (!categoriaExistente) {
      res.status(404).json({ mensaje: `No se encontró categoria con ID: ${id}` });
      return;
    }

    // Verificar si la categoría tiene productos asociados
    if (categoriaExistente.productos.length > 0) {
      res.status(400).json({
        mensaje: 'No se puede eliminar la categoria porque tiene productos asociados',
        productosAsociados: categoriaExistente.productos.length
      });
      return;
    }

    await prisma.categoria.delete({
      where: { id: Number(id) }
    });
    
    res.json({
      mensaje: 'Categoria eliminada correctamente',
      datos: categoriaExistente
    });
  } catch (error) {
    console.error(`Error al eliminar categoria con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al eliminar la categoria', error });
  }
};
