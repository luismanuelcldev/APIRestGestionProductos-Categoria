import { Router } from 'express';
import { 
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria 
} from '../controladores/categorias.controller';
import { validarCuerpo, validarCategoria } from '../middlewares/validacion';
import { verificarToken, verificarAdmin } from '../autenticacion/jwt';

const router = Router();

// Rutas de categorías
router.get('/categorias', verificarToken, obtenerCategorias);
router.get('/categorias/:id', verificarToken, obtenerCategoriaPorId);
router.post('/categorias', verificarToken, verificarAdmin, validarCuerpo, validarCategoria, crearCategoria);
router.put('/categorias/:id', verificarToken, verificarAdmin, validarCuerpo, validarCategoria, actualizarCategoria);
router.delete('/categorias/:id', verificarToken, verificarAdmin, eliminarCategoria);

export default router;
