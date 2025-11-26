# API REST de Gestión de Productos

Esta API REST proporciona un sistema completo para la gestión de productos y categorías. Desarrollada con TypeScript, Express y Prisma ORM, ofrece funcionalidades avanzadas como autenticación JWT, sistema de roles de usuario, paginación, filtrado y documentación interactiva con Swagger UI.

La API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre productos y categorías, manteniendo relaciones entre ellos y proporcionando un control de acceso basado en roles para garantizar la seguridad de las operaciones.

## Tabla de Contenido

- [Descripción General](#descripción-general)
- [Caracteristicas](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
  - [Ejecutar en Desarrollo](#ejecutar-en-desarrollo)
  - [Base de Datos](#base-de-datos)
  - [Usuario Administrador](#usuario-administrador)
- [Documentación de la API](#documentación-de-la-api)
  - [Autenticación](#autenticación)
  - [Productos](#productos)
  - [Categorías](#categorías)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Paginación y Filtrado](#paginación-y-filtrado)
- [Sistema de Logs](#sistema-de-logs)
- [Seguridad](#seguridad)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Contacto](#contacto)


## Características

- **CRUD completo** para productos y categorías
- **Autenticación con JWT** (JSON Web Tokens)
- **Control de acceso basado en roles** (Administrador, Usuario, Consultor)
- **Paginación y filtrado avanzado** para consultas eficientes
- **Validación de datos** en todas las solicitudes
- **Documentación interactiva** con Swagger UI
- **Logging avanzado** con Winston para monitoreo y depuración
- **Relaciones entre entidades** (productos pertenecen a categorías)
- **Manejo de errores** personalizado y consistente
- **Base de datos SQLite** con Prisma ORM para desarrollo rápido
- **Scripts de migración y semillas** para configuración inicial

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **TypeScript**: Lenguaje de tipado estático que compila a JavaScript
- **Express**: Framework web rápido y minimalista para Node.js
- **Prisma ORM**: ORM moderno para TypeScript y Node.js
- **SQLite**: Base de datos relacional ligera
- **JWT (JSON Web Tokens)**: Para autenticación segura
- **bcrypt**: Para el hash seguro de contraseñas
- **Winston**: Sistema de logging avanzado
- **Swagger UI**: Documentación interactiva de la API
- **CORS, Helmet**: Middleware de seguridad
- **nodemon**: Para desarrollo con recarga automática

## Estructura del Proyecto

```
/rest-api-productos/
├── prisma/                       # Configuración de Prisma ORM
│   ├── schema.prisma             # Esquema de la base de datos
│   ├── dev.db                    # Base de datos SQLite
│   └── migrations/               # Migraciones de la base de datos
│
├── src/                          # Código fuente
│   ├── autenticacion/            # Lógica de autenticación
│   │   ├── auth.controller.ts    # Controlador de autenticación
│   │   ├── auth.routes.ts        # Rutas de autenticación
│   │   └── jwt.ts                # Utilidades JWT
│   │
│   ├── config/                   # Configuración del servidor
│   │   ├── config.ts             # Variables de configuración
│   │   └── logger.ts             # Configuración del sistema de logs
│   │
│   ├── controladores/            # Controladores de la API
│   │   ├── productos.controller.ts
│   │   └── categorias.controller.ts
│   │
│   ├── documentacion/            # Configuración de Swagger
│   │   ├── swagger.config.ts     # Configuración general de Swagger
│   │   ├── productos.docs.ts     # Documentación de productos
│   │   └── categorias.docs.ts    # Documentación de categorías
│   │
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── validacion.ts         # Validación de datos
│   │   └── error.middleware.ts   # Manejo de errores
│   │
│   ├── routes/                   # Definición de rutas
│   │   ├── productos.routes.ts
│   │   └── categorias.routes.ts
│   │
│   ├── utils/                    # Utilidades
│   │   ├── paginacion.ts         # Utilidades de paginación
│   │   └── filtros.ts            # Utilidades de filtrado
│   │
│   ├── index.ts                  # Punto de entrada de la aplicación
│   ├── checkDb.ts                # Script para verificar la BD
│   ├── seedData.ts               # Script para poblar la BD
│   └── crearAdmin.ts             # Script para crear un administrador
│
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Este archivo
```

## Requisitos Previos

- **Node.js** (versión 14.0.0 o superior)
- **npm** (versión 6.0.0 o superior)
- **Git** (Para clonar el repositorio)

## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tuusuario/rest-api-productos.git
   cd rest-api-productos
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus configuraciones
   ```

4. **Compilar el proyecto**:
   ```bash
   npm run build
   ```

## Configuración

### Usuario Administrador

Para crear un usuario administrador inicial:

```bash
npm run admin:crear
```

Esto creará un usuario con las siguientes credenciales:
- **Usuario**: admin
- **Contraseña**: admin123

> **Importante**: Por seguridad, cambiar esta contraseña después del primer inicio de sesión.

## Uso

### Ejecutar la API en Desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3001`.

### Base de Datos

Para explorar la base de datos usando Prisma Studio:

```bash
npm run prisma:studio
```
Prisma Studio estará disponible en `http://localhost:5555`.

## Documentación de la API

La documentación interactiva de la API está disponible en:

```
http://localhost:3001/api-docs
```

### Autenticación

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `POST` | `/api/auth/registrar` | Registrar un nuevo usuario | Público |
| `POST` | `/api/auth/login` | Iniciar sesión | Público |
| `GET` | `/api/auth/perfil` | Obtener perfil del usuario autenticado | Autenticado |

### Productos

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `GET` | `/api/productos` | Obtener todos los productos (con filtros y paginación) | Autenticado |
| `GET` | `/api/productos/:id` | Obtener un producto por ID | Autenticado |
| `POST` | `/api/productos` | Crear un nuevo producto | Administrador |
| `PUT` | `/api/productos/:id` | Actualizar un producto existente | Administrador |
| `DELETE` | `/api/productos/:id` | Eliminar un producto | Administrador |

### Categorías

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `GET` | `/api/categorias` | Obtener todas las categorías | Autenticado |
| `GET` | `/api/categorias/:id` | Obtener una categoría por ID | Autenticado |
| `POST` | `/api/categorias` | Crear una nueva categoría | Administrador |
| `PUT` | `/api/categorias/:id` | Actualizar una categoría existente | Administrador |
| `DELETE` | `/api/categorias/:id` | Eliminar una categoría | Administrador |

## Ejemplos de uso

### Crear un Producto (POST)

**URL:** `http://localhost:3001/api/productos`
**Headers:** `Authorization: Bearer <TU_TOKEN>`
**Body (JSON):**
```json
{
    "nombre": "Laptop Gamer",
    "precio": 1500,
    "stock": 20,
    "categoriaId": 1
}
```

### Crear una Categoría (POST)

**URL:** `http://localhost:3001/api/categorias`
**Headers:** `Authorization: Bearer <TU_TOKEN>`
**Body (JSON):**
```json
{
    "nombre": "Tecnología"
}
```

## Paginación y Filtrado

### Parámetros de paginación

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `pagina` | integer | Numero de pagina | `?pagina=2` |
| `limite` | integer | Elementos por pagina | `?limite=10` |

### Parametros de ordenamiento

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ordenarPor` | string | Campo por el cual ordenar | `?ordenarPor=precio` |
| `ordenarDireccion` | string | Dirección de ordenamiento (asc/desc) | `?ordenarDireccion=desc` |

### Parametros de filtrado (productos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `precioMin` | integer | Precio mínimo | `?precioMin=500` |
| `precioMax` | integer | Precio máximo | `?precioMax=2000` |
| `categoriaId` | integer | ID de categoría | `?categoriaId=1` |
| `stock` | boolean | Productos con stock | `?stock=true` |
| `buscar` | string | Búsqueda por nombre | `?buscar=teclado` |

## Sistema de Logs

La API utiliza Winston como sistema de logging, configurado para registrar:

- **Solicitudes HTTP** (método, URL, codigo de estado, tiempo de respuesta)
- **Errores** con detalles completos en modo desarrollo
- **Actividad de autenticación** (inicios de sesión, registros)
- **Operaciones CRUD** en productos y categorías

## Seguridad

La API implementa varias capas de seguridad:

1. **Autenticación JWT** con tiempo de expiración configurable
2. **Hash de contraseñas** con bcrypt
3. **Control de acceso basado en roles**
4. **Headers de seguridad** con Helmet
5. **Protección contra CORS**
6. **Validación de datos** en todas las entradas
7. **Sanitización de respuestas** para evitar filtracion de datos sensibles
8. **Rate limiting** para prevenir ataques de fuerza bruta

## Contribución

1. Haz un Fork del proyecto
2. Crea tu rama de funcionalidad (`git checkout -b featur/(la nueva funcionalidad)`)
3. Realiza tus cambios y haz commit (`git commit -m '(Añadir la nueva funcionalidad)'`)
4. Haz Push a tu rama (`git push origin feature/(La ueva-funcionalidad implementada)`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia GNU GPL.

## Contacto

Luis Manuel De La Cruz Ledesma - [ledesmadelacruzluismanuel@gmail.com](ledesmadelacruzluismanuel@gmail.com)

Link del Proyecto: [https://github.com/luismanuelcldev/rest-api-productos](https://github.com/luismanuelcldev/rest-api-productos)

---

Desarrollado con ❤️ usando Node.js, TypeScript y Prisma.