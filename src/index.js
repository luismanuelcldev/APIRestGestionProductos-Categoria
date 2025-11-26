import express from "express";

// Importo las rutas de productos y categorías
import productosRouter from "./routes/productos.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";

// Inicializo la aplicación Express
const app = express();

// Configuro el middleware para parsear JSON
app.use(express.json());

// Configuro las rutas de la API
app.use('/api', productosRouter);
app.use('/api', categoriasRouter);

// Inicio el servidor en el puerto 3000
app.listen(3000)
console.log('Servidor corriendo en el puerto', 3000)

