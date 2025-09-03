"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categorías]
 *     description: Retorna un listado de categorías disponibles en la base de datos con soporte para paginación y filtros.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginaParam'
 *       - $ref: '#/components/parameters/limiteParam'
 *       - $ref: '#/components/parameters/ordenarPorParam'
 *       - $ref: '#/components/parameters/ordenarDireccionParam'
 *       - $ref: '#/components/parameters/nombreFiltroParam'
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
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
 *                     $ref: '#/components/schemas/Categoria'
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
 *     summary: Crea una nueva categoría
 *     tags: [Categorías]
 *     description: Crea una nueva categoría en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCategoria'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [Categorías]
 *     description: Retorna una categoría específica basada en su ID y los productos asociados a ella.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a obtener
 *     responses:
 *       200:
 *         description: Categoría obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCategoria'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categorías]
 *     description: Actualiza los datos de una categoría existente basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCategoria'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categorías]
 *     description: Elimina una categoría específica basada en su ID. No se pueden eliminar categorías que tienen productos asociados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCategoria'
 *       400:
 *         description: No se puede eliminar la categoría porque tiene productos asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'No se puede eliminar la categoría porque tiene productos asociados'
 *                 productosAsociados:
 *                   type: integer
 *                   example: 3
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
