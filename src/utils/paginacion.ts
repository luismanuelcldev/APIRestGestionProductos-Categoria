import { Request } from 'express';
import { config } from '../config/config';

// Interfaces para la paginación y filtrado
export interface OpcionesPaginacion {
  pagina: number;
  limite: number;
  ordenarPor: string;
  ordenarDireccion: 'asc' | 'desc';
  skip: number;
  take: number;
}

export interface MetadatosPaginacion {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
  siguiente: number | null;
  anterior: number | null;
}

// Analizar parámetros de paginación desde la solicitud
export const obtenerOpcionesPaginacion = (req: Request): OpcionesPaginacion => {
  const { paginacionPredeterminada } = config;
  
  // Obtener parámetros de la solicitud
  const pagina = Math.max(1, parseInt(req.query.pagina as string) || paginacionPredeterminada.pagina);
  const limite = Math.max(1, parseInt(req.query.limite as string) || paginacionPredeterminada.limite);
  const ordenarPor = (req.query.ordenarPor as string) || paginacionPredeterminada.ordenarPor;
  const ordenarDireccion = ((req.query.ordenarDireccion as string)?.toLowerCase() === 'desc') ? 'desc' : 'asc';
  
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

// Generar metadatos de paginación para la respuesta
export const generarMetadatosPaginacion = (totalRegistros: number, opciones: OpcionesPaginacion): MetadatosPaginacion => {
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
