"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.obtenerCategoriaPorId = exports.obtenerCategorias = void 0;
const client_1 = require("@prisma/client");
const paginacion_1 = require("../utils/paginacion");
const filtros_1 = require("../utils/filtros");
const logger_1 = require("../config/logger");
const prisma = new client_1.PrismaClient();
// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        // Obtener opciones de paginación
        const opcionesPaginacion = (0, paginacion_1.obtenerOpcionesPaginacion)(req);
        // Construir filtros
        const filtros = (0, filtros_1.construirFiltrosCategoria)(req);
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
        const metadatosPaginacion = (0, paginacion_1.generarMetadatosPaginacion)(totalCategorias, opcionesPaginacion);
        logger_1.logger.debug(`Consulta de categorías con ${filtros ? Object.keys(filtros).length : 0} filtros - Página ${opcionesPaginacion.pagina}`);
        res.json({
            mensaje: 'Categorías obtenidas correctamente',
            datos: categorias,
            paginacion: metadatosPaginacion
        });
    }
    catch (error) {
        logger_1.logger.error(`Error al obtener categorías: ${error}`);
        res.status(500).json({ mensaje: 'Error al obtener las categorías', error });
    }
};
exports.obtenerCategorias = obtenerCategorias;
// Obtener una categoría específica por ID
const obtenerCategoriaPorId = async (req, res) => {
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
    }
    catch (error) {
        console.error(`Error al obtener categoría con ID ${id}:`, error);
        res.status(500).json({ mensaje: 'Error al obtener la categoría', error });
    }
};
exports.obtenerCategoriaPorId = obtenerCategoriaPorId;
// Crear una nueva categoría
const crearCategoria = async (req, res) => {
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
    }
    catch (error) {
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
exports.crearCategoria = crearCategoria;
// Actualizar una categoría existente
const actualizarCategoria = async (req, res) => {
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
    }
    catch (error) {
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
exports.actualizarCategoria = actualizarCategoria;
// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
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
    }
    catch (error) {
        console.error(`Error al eliminar categoria con ID ${id}:`, error);
        res.status(500).json({ mensaje: 'Error al eliminar la categoria', error });
    }
};
exports.eliminarCategoria = eliminarCategoria;
