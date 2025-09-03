"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.construirFiltrosCategoria = exports.construirFiltrosProducto = void 0;
// Funciones para construir filtros dinámicos para Prisma
const construirFiltrosProducto = (req) => {
    const filtros = {};
    // Filtrar por nombre
    if (req.query.nombre) {
        filtros.nombre = {
            contains: req.query.nombre
        };
    }
    // Filtrar por rango de precio
    if (req.query.precioMin || req.query.precioMax) {
        filtros.precio = {};
        if (req.query.precioMin) {
            filtros.precio.gte = parseInt(req.query.precioMin);
        }
        if (req.query.precioMax) {
            filtros.precio.lte = parseInt(req.query.precioMax);
        }
    }
    // Filtrar por categoría
    if (req.query.categoriaId) {
        filtros.categoriaId = parseInt(req.query.categoriaId);
    }
    // Filtrar por stock disponible
    if (req.query.stockMin) {
        filtros.stock = {
            gte: parseInt(req.query.stockMin)
        };
    }
    return filtros;
};
exports.construirFiltrosProducto = construirFiltrosProducto;
const construirFiltrosCategoria = (req) => {
    const filtros = {};
    // Filtrar por nombre
    if (req.query.nombre) {
        filtros.nombre = {
            contains: req.query.nombre
        };
    }
    return filtros;
};
exports.construirFiltrosCategoria = construirFiltrosCategoria;
