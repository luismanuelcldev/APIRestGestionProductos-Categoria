import swaggerJSDoc from 'swagger-jsdoc';

// Opciones básicas de Swagger
const opcionesSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST de Productos y Categorías',
      version: '1.0.0',
      description: 'Documentación de la API REST para gestionar productos y categorías con Prisma y Express',
      contact: {
        name: 'Soporte API',
        email: 'soporte@apiproductos.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      },
    ],
    tags: [
      {
        name: 'Productos',
        description: 'Operaciones relacionadas con productos'
      },
      {
        name: 'Autenticación',
        description: 'Operaciones de registro, inicio de sesión y gestión de usuarios'
      },
      {
        name: 'Categorías',
        description: 'Operaciones relacionadas con categorías'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce tu token JWT con el formato: Bearer {tu-token}'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje descriptivo del error'
            },
            error: {
              type: 'object',
              description: 'Detalles del error (solo en desarrollo)'
            }
          }
        },
        Producto: {
          type: 'object',
          required: ['nombre', 'categoriaId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identificador único del producto'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del producto (único)'
            },
            precio: {
              type: 'integer',
              description: 'Precio del producto en centavos/céntimos'
            },
            stock: {
              type: 'integer',
              description: 'Cantidad disponible en inventario'
            },
            fechaHoraReg: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de registro del producto'
            },
            categoriaId: {
              type: 'integer',
              description: 'ID de la categoría a la que pertenece el producto'
            },
            categoria: {
              $ref: '#/components/schemas/Categoria',
              description: 'Categoría a la que pertenece el producto'
            }
          }
        },
        ProductoInput: {
          type: 'object',
          required: ['nombre', 'categoriaId'],
          properties: {
            nombre: {
              type: 'string',
              description: 'Nombre del producto (único)',
              example: 'Smartphone de última generación'
            },
            precio: {
              type: 'integer',
              description: 'Precio del producto en centavos/céntimos',
              example: 99900
            },
            stock: {
              type: 'integer',
              description: 'Cantidad disponible en inventario',
              example: 50
            },
            categoriaId: {
              type: 'integer',
              description: 'ID de la categoría a la que pertenece el producto',
              example: 1
            }
          }
        },
        Categoria: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identificador único de la categoría'
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría (único)'
            },
            productos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Producto'
              },
              description: 'Productos que pertenecen a esta categoría'
            }
          }
        },
        CategoriaInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría (único)',
              example: 'Electrónica'
            }
          }
        },
        RespuestaProducto: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje descriptivo de la operación'
            },
            datos: {
              $ref: '#/components/schemas/Producto'
            }
          }
        },
        RespuestaProductos: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje descriptivo de la operación'
            },
            datos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Producto'
              }
            },
            total: {
              type: 'integer',
              description: 'Número total de productos'
            }
          }
        },
        RespuestaCategoria: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje descriptivo de la operación'
            },
            datos: {
              $ref: '#/components/schemas/Categoria'
            }
          }
        },
        RespuestaCategorias: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje descriptivo de la operación'
            },
            datos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Categoria'
              }
            },
            total: {
              type: 'integer',
              description: 'Número total de categorías'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                mensaje: 'El campo nombre es obligatorio'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                mensaje: 'No se encontró producto con ID: 1'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                mensaje: 'Error al obtener los productos',
                error: {}
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/documentacion/*.ts', './src/autenticacion/*.ts']
};

// Inicializar Swagger JSDoc
const swaggerSpec = swaggerJSDoc(opcionesSwagger);

export default swaggerSpec;
