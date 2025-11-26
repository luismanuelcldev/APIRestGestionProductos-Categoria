import { Router } from 'express';
import { registrar, iniciarSesion, perfil } from '../autenticacion/auth.controller';
import { verificarToken } from '../autenticacion/jwt';

const router = Router();

// Rutas públicas
router.post('/auth/registrar', registrar);
router.post('/auth/login', iniciarSesion);

// Rutas protegidas
router.get('/auth/perfil', verificarToken, perfil);

export default router;
