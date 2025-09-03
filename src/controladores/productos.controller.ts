import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { obtenerOpcionesPaginacion, generarMetadatosPaginacion } from '../utils/paginacion';
import { construirFiltrosProducto } from '../utils/filtros';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

// Obtener todos los productos
export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener opciones de paginación
    const opcionesPaginacion = obtenerOpcionesPaginacion(req);
    
    // Construir filtros
    const filtros = construirFiltrosProducto(req);
    
    // Contar total de registros para paginación
    const totalProductos = await prisma.producto.count({
      where: filtros
    });
    
    // Obtener productos con paginación y filtros
    const productos = await prisma.producto.findMany({
      where: filtros,
      skip: opcionesPaginacion.skip,
      take: opcionesPaginacion.take,
      orderBy: {
        [opcionesPaginacion.ordenarPor]: opcionesPaginacion.ordenarDireccion
      },
      include: {
        categoria: true
      }
    });
    
    // Generar metadatos de paginación
    const metadatosPaginacion = generarMetadatosPaginacion(totalProductos, opcionesPaginacion);
    
    logger.debug(`Consulta de productos con ${filtros ? Object.keys(filtros).length : 0} filtros - Página ${opcionesPaginacion.pagina}`);
    
    res.json({
      mensaje: 'Productos obtenidos correctamente',
      datos: productos,
      paginacion: metadatosPaginacion
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los productos', error });
  }
};

// Obtener un producto específico por ID
export const obtenerProductoPorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
      include: {
        categoria: true
      }
    });
    
    if (!producto) {
      res.status(404).json({ mensaje: `No se encontró producto con ID: ${id}` });
      return;
    }
    
    res.json({
      mensaje: 'Producto obtenido correctamente',
      datos: producto
    });
  } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al obtener el producto', error });
  }
};

// Crear un nuevo producto
export const crearProducto = async (req: Request, res: Response): Promise<void> => {
  const { nombre, precio, stock, categoriaId } = req.body;
  
  try {
    // Verificar si la categoría existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: Number(categoriaId) }
    });

    if (!categoriaExistente) {
      res.status(404).json({ mensaje: `No existe categoría con ID: ${categoriaId}` });
      return;
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio: Number(precio),
        stock: Number(stock) || 0,
        categoriaId: Number(categoriaId)
      },
      include: {
        categoria: true
      }
    });
    
    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      datos: nuevoProducto
    });
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    
    // Capturar error de unicidad para nombre de producto
    if (error.code === 'P2002') {
      res.status(400).json({ 
        mensaje: 'Ya existe un producto con ese nombre',
        campo: error.meta?.target[0] || 'nombre'
      });
      return;
    }
    
    res.status(500).json({ mensaje: 'Error al crear el producto', error });
  }
};

// Actualizar un producto existente
export const actualizarProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, precio, stock, categoriaId } = req.body;
  
  try {
    // Verificar si el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id: Number(id) }
    });

    if (!productoExistente) {
      res.status(404).json({ mensaje: `No se encontró producto con ID: ${id}` });
      return;
    }

    // Verificar si la categoría existe, si se intenta actualizar
    if (categoriaId) {
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id: Number(categoriaId) }
      });

      if (!categoriaExistente) {
        res.status(404).json({ mensaje: `No existe categoría con ID: ${categoriaId}` });
        return;
      }
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(id) },
      data: {
        ...(nombre && { nombre }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(categoriaId && { categoriaId: Number(categoriaId) })
      },
      include: {
        categoria: true
      }
    });
    
    res.json({
      mensaje: 'Producto actualizado correctamente',
      datos: productoActualizado
    });
  } catch (error: any) {
    console.error(`Error al actualizar producto con ID ${id}:`, error);
    
    // Capturar error de unicidad para nombre de producto
    if (error.code === 'P2002') {
      res.status(400).json({ 
        mensaje: 'Ya existe otro producto con ese nombre',
        campo: error.meta?.target[0] || 'nombre'
      });
      return;
    }
    
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    // Verificar si el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id: Number(id) }
    });

    if (!productoExistente) {
      res.status(404).json({ mensaje: `No se encontró producto con ID: ${id}` });
      return;
    }

    await prisma.producto.delete({
      where: { id: Number(id) }
    });
    
    res.json({
      mensaje: 'Producto eliminado correctamente',
      datos: productoExistente
    });
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
  }
};
