"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarMetadatosPaginacion = exports.obtenerOpcionesPaginacion = void 0;
const config_1 = require("../config/config");
// Analizar parámetros de paginación desde la solicitud
const obtenerOpcionesPaginacion = (req) => {
    const { paginacionPredeterminada } = config_1.config;
    // Obtener parámetros de la solicitud
    const pagina = Math.max(1, parseInt(req.query.pagina) || paginacionPredeterminada.pagina);
    const limite = Math.max(1, parseInt(req.query.limite) || paginacionPredeterminada.limite);
    const ordenarPor = req.query.ordenarPor || paginacionPredeterminada.ordenarPor;
    const ordenarDireccion = (req.query.ordenarDireccion?.toLowerCase() === 'desc') ? 'desc' : 'asc';
    // Calcular skip y take para Prisma
    const skip = (pagina - 1) * limite;
    const take = limite;
    return {
        pagina,
        limite,
        ordenarPor,
        ordenarDireccion,
        skip,
        take
    };
};
exports.obtenerOpcionesPaginacion = obtenerOpcionesPaginacion;
// Generar metadatos de paginación para la respuesta
const generarMetadatosPaginacion = (totalRegistros, opciones) => {
    const totalPaginas = Math.ceil(totalRegistros / opciones.limite);
    return {
        paginaActual: opciones.pagina,
        totalPaginas,
        totalRegistros,
        registrosPorPagina: opciones.limite,
        siguiente: opciones.pagina < totalPaginas ? opciones.pagina + 1 : null,
        anterior: opciones.pagina > 1 ? opciones.pagina - 1 : null
    };
};
exports.generarMetadatosPaginacion = generarMetadatosPaginacion;
