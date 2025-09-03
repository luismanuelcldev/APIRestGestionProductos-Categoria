"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * components:
 *   schemas:
 *     Paginacion:
 *       type: object
 *       properties:
 *         paginaActual:
 *           type: integer
 *           description: Número de página actual
 *         totalPaginas:
 *           type: integer
 *           description: Total de páginas disponibles
 *         totalRegistros:
 *           type: integer
 *           description: Número total de registros
 *         registrosPorPagina:
 *           type: integer
 *           description: Número de registros por página
 *         siguiente:
 *           type: integer
 *           nullable: true
 *           description: Número de la siguiente página (null si es la última)
 *         anterior:
 *           type: integer
 *           nullable: true
 *           description: Número de la página anterior (null si es la primera)
 *   parameters:
 *     paginaParam:
 *       in: query
 *       name: pagina
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Número de página a mostrar
 *     limiteParam:
 *       in: query
 *       name: limite
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Número de registros por página
 *     ordenarPorParam:
 *       in: query
 *       name: ordenarPor
 *       schema:
 *         type: string
 *         default: "id"
 *       description: Campo por el cual ordenar los resultados
 *     ordenarDireccionParam:
 *       in: query
 *       name: ordenarDireccion
 *       schema:
 *         type: string
 *         default: "asc"
 *         enum: [asc, desc]
 *       description: Dirección de ordenamiento (ascendente o descendente)
 *     nombreFiltroParam:
 *       in: query
 *       name: nombre
 *       schema:
 *         type: string
 *       description: Filtrar por nombre (búsqueda parcial)
 *     precioMinParam:
 *       in: query
 *       name: precioMin
 *       schema:
 *         type: integer
 *       description: Precio mínimo para filtrar productos
 *     precioMaxParam:
 *       in: query
 *       name: precioMax
 *       schema:
 *         type: integer
 *       description: Precio máximo para filtrar productos
 *     categoriaIdParam:
 *       in: query
 *       name: categoriaId
 *       schema:
 *         type: integer
 *       description: ID de la categoría para filtrar productos
 *     stockMinParam:
 *       in: query
 *       name: stockMin
 *       schema:
 *         type: integer
 *       description: Stock mínimo para filtrar productos
 */
