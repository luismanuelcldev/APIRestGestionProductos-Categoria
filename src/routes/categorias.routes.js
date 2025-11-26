import { Router } from "express";

// Inicializo el router de Express
const router = Router();

// Defino la ruta para obtener todas las categorías
router.get('/categorias', (req, res) => {
    res.send('Categorias de todos los productos');        
});

// Exporto el router
export default router;
