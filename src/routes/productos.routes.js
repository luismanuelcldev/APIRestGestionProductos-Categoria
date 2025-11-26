import { Router } from "express";
import { PrismaClient } from "@prisma/client"; 

// Inicializo el router y el cliente de Prisma
const router = Router();
const prisma = new PrismaClient()

// Defino la ruta para obtener todos los productos
router.get('/productos', async (req, res) => {
    const productos = await prisma.producto.findMany();
    res.json(productos)      
})

// Defino la ruta para crear un nuevo producto
router.post('/productos', async (req, res) => {
    const nuevoProducto = await prisma.producto.create({
        data: req.body,
    });
    res.json(nuevoProducto);
});         

// Exporto el router
export default router;
