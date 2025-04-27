
import { DocumentStructure } from './types';

export const documentStructures: Record<string, DocumentStructure> = {
  'peticao-inicial': {
    tipo: 'Petição Inicial',
    secoes: [
      'cabecalho',
      'qualificacao',
      'fatos',
      'fundamentos',
      'pedidos',
      'conclusao'
    ]
  },
  'contestacao': {
    tipo: 'Contestação',
    secoes: [
      'cabecalho',
      'qualificacao',
      'preliminares',
      'fatos',
      'fundamentos',
      'pedidos',
      'conclusao'
    ]
  },
  'recurso': {
    tipo: 'Recurso',
    secoes: [
      'cabecalho',
      'qualificacao',
      'tempestividade',
      'sintese',
      'fundamentos',
      'pedidos',
      'conclusao'
    ]
  },
  'parecer': {
    tipo: 'Parecer Jurídico',
    secoes: [
      'cabecalho',
      'consulta',
      'fatos',
      'analise',
      'conclusao'
    ]
  }
};
