import { Router } from 'express';
// Importo los controladores de productos
import { 
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controladores/productos.controller';
// Importo los middlewares de validación
import { validarCuerpo, validarProducto } from '../middlewares/validacion';
// Importo los middlewares de autenticación
import { verificarToken, verificarAdmin } from '../autenticacion/jwt';

// Inicializo el router
const router = Router();

// Defino las rutas de productos con sus middlewares
router.get('/productos', verificarToken, obtenerProductos);
router.get('/productos/:id', verificarToken, obtenerProductoPorId);
router.post('/productos', verificarToken, verificarAdmin, validarCuerpo, validarProducto, crearProducto);
router.put('/productos/:id', verificarToken, verificarAdmin, validarCuerpo, validarProducto, actualizarProducto);
router.delete('/productos/:id', verificarToken, verificarAdmin, eliminarProducto);

// Exporto el router
export default router;
