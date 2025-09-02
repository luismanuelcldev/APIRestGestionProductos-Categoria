"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorias_controller_1 = require("../controladores/categorias.controller");
const validacion_1 = require("../middlewares/validacion");
const jwt_1 = require("../autenticacion/jwt");
const router = (0, express_1.Router)();
// Rutas de categorías
router.get('/categorias', jwt_1.verificarToken, categorias_controller_1.obtenerCategorias);
router.get('/categorias/:id', jwt_1.verificarToken, categorias_controller_1.obtenerCategoriaPorId);
router.post('/categorias', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarCategoria, categorias_controller_1.crearCategoria);
router.put('/categorias/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarCategoria, categorias_controller_1.actualizarCategoria);
router.delete('/categorias/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, categorias_controller_1.eliminarCategoria);
exports.default = router;
