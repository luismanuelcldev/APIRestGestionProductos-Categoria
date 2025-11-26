"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importo los controladores de categorías
const categorias_controller_1 = require("../controladores/categorias.controller");
// Importo los middlewares de validación
const validacion_1 = require("../middlewares/validacion");
// Importo los middlewares de autenticación
const jwt_1 = require("../autenticacion/jwt");
// Inicializo el router
const router = (0, express_1.Router)();
// Defino las rutas de categorías con sus middlewares
router.get('/categorias', jwt_1.verificarToken, categorias_controller_1.obtenerCategorias);
router.get('/categorias/:id', jwt_1.verificarToken, categorias_controller_1.obtenerCategoriaPorId);
router.post('/categorias', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarCategoria, categorias_controller_1.crearCategoria);
router.put('/categorias/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarCategoria, categorias_controller_1.actualizarCategoria);
router.delete('/categorias/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, categorias_controller_1.eliminarCategoria);
// Exporto el router
exports.default = router;
