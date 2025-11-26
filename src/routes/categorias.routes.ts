import { Router } from 'express';
// Importo los controladores de categorías
import { 
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria 
} from '../controladores/categorias.controller';
// Importo los middlewares de validación
import { validarCuerpo, validarCategoria } from '../middlewares/validacion';
// Importo los middlewares de autenticación
import { verificarToken, verificarAdmin } from '../autenticacion/jwt';

// Inicializo el router
const router = Router();

// Defino las rutas de categorías con sus middlewares
router.get('/categorias', verificarToken, obtenerCategorias);
router.get('/categorias/:id', verificarToken, obtenerCategoriaPorId);
router.post('/categorias', verificarToken, verificarAdmin, validarCuerpo, validarCategoria, crearCategoria);
router.put('/categorias/:id', verificarToken, verificarAdmin, validarCuerpo, validarCategoria, actualizarCategoria);
router.delete('/categorias/:id', verificarToken, verificarAdmin, eliminarCategoria);

// Exporto el router
export default router;
