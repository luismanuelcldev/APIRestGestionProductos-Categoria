"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importo los controladores de productos
const productos_controller_1 = require("../controladores/productos.controller");
// Importo los middlewares de validación
const validacion_1 = require("../middlewares/validacion");
// Importo los middlewares de autenticación
const jwt_1 = require("../autenticacion/jwt");
// Inicializo el router
const router = (0, express_1.Router)();
// Defino las rutas de productos con sus middlewares
router.get('/productos', jwt_1.verificarToken, productos_controller_1.obtenerProductos);
router.get('/productos/:id', jwt_1.verificarToken, productos_controller_1.obtenerProductoPorId);
router.post('/productos', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarProducto, productos_controller_1.crearProducto);
router.put('/productos/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, validacion_1.validarCuerpo, validacion_1.validarProducto, productos_controller_1.actualizarProducto);
router.delete('/productos/:id', jwt_1.verificarToken, jwt_1.verificarAdmin, productos_controller_1.eliminarProducto);
// Exporto el router
exports.default = router;
