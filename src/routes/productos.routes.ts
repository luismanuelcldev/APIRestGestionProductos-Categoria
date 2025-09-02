import { Router } from 'express';
import { 
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controladores/productos.controller';
import { validarCuerpo, validarProducto } from '../middlewares/validacion';
import { verificarToken, verificarAdmin } from '../autenticacion/jwt';

const router = Router();

// Rutas de productos
router.get('/productos', verificarToken, obtenerProductos);
router.get('/productos/:id', verificarToken, obtenerProductoPorId);
router.post('/productos', verificarToken, verificarAdmin, validarCuerpo, validarProducto, crearProducto);
router.put('/productos/:id', verificarToken, verificarAdmin, validarCuerpo, validarProducto, actualizarProducto);
router.delete('/productos/:id', verificarToken, verificarAdmin, eliminarProducto);

export default router;
