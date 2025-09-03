"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     description: Retorna un listado de productos disponibles en la base de datos con soporte para paginación y filtros.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginaParam'
 *       - $ref: '#/components/parameters/limiteParam'
 *       - $ref: '#/components/parameters/ordenarPorParam'
 *       - $ref: '#/components/parameters/ordenarDireccionParam'
 *       - $ref: '#/components/parameters/nombreFiltroParam'
 *       - $ref: '#/components/parameters/precioMinParam'
 *       - $ref: '#/components/parameters/precioMaxParam'
 *       - $ref: '#/components/parameters/categoriaIdParam'
 *       - $ref: '#/components/parameters/stockMinParam'
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje descriptivo de la operación
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 *                 paginacion:
 *                   $ref: '#/components/schemas/Paginacion'
 *       401:
 *         description: Usuario no autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso denegado: Token no proporcionado"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     description: Crea un nuevo producto en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaProducto'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               mensaje: 'No existe categoría con ID: 99'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Productos]
 *     description: Retorna un producto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaProducto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Productos]
 *     description: Actualiza los datos de un producto existente basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaProducto'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Productos]
 *     description: Elimina un producto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaProducto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
