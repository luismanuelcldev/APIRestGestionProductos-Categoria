"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../autenticacion/auth.controller");
const jwt_1 = require("../autenticacion/jwt");
const router = (0, express_1.Router)();
// Rutas públicas
router.post('/auth/registrar', auth_controller_1.registrar);
router.post('/auth/login', auth_controller_1.iniciarSesion);
// Rutas protegidas
router.get('/auth/perfil', jwt_1.verificarToken, auth_controller_1.perfil);
exports.default = router;
