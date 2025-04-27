
export interface DocumentStructure {
  tipo: string;
  secoes: string[];
  modelos?: Record<string, string>;
}

export type DocumentType = 'peticao-inicial' | 'contestacao' | 'recurso' | 'parecer';

export interface GeneratedDocument {
  content: string;
  sections: string[];
}

export interface DocumentData {
  court?: string;
  client?: string;
  number?: string;
}
