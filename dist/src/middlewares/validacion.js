"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCategoria = exports.validarProducto = exports.validarCuerpo = void 0;
// Middleware para validar el cuerpo de las solicitudes
const validarCuerpo = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ mensaje: 'El cuerpo de la solicitud está vacío' });
    }
    next();
};
exports.validarCuerpo = validarCuerpo;
// Middleware para validar que los campos obligatorios estén presentes para productos
const validarProducto = (req, res, next) => {
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
exports.validarProducto = validarProducto;
// Middleware para validar que los campos obligatorios estén presentes para categorías
const validarCategoria = (req, res, next) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
    }
    next();
};
exports.validarCategoria = validarCategoria;
