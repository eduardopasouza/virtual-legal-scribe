
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentMetadata } from "@/hooks/useDocuments";
import { FileText, FolderOpen, FileArchive } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CaseDocumentsOrganizerProps {
  documents: DocumentMetadata[];
  onSelectDocument: (document: DocumentMetadata) => void;
}

// Categories for document organization
const DOCUMENT_CATEGORIES = {
  PETICOES: 'petições',
  EVIDENCIAS: 'evidências',
  DECISOES: 'decisões',
  CONTRATOS: 'contratos',
  PESQUISAS: 'pesquisas',
  ANALISES: 'análises',
  ESTRATEGIAS: 'estratégias',
  OUTROS: 'outros',
};

// Function to categorize documents based on name and type
const categorizeDocument = (doc: DocumentMetadata): string => {
  const name = doc.name.toLowerCase();
  
  if (name.includes('petição') || name.includes('peticao') || name.endsWith('.doc') || name.endsWith('.docx')) {
    return DOCUMENT_CATEGORIES.PETICOES;
  } else if (name.includes('prova') || name.includes('evidência') || name.includes('evidencia') || name.endsWith('.jpg') || name.endsWith('.png')) {
    return DOCUMENT_CATEGORIES.EVIDENCIAS;
  } else if (name.includes('decisão') || name.includes('decisao') || name.includes('sentença') || name.includes('sentenca')) {
    return DOCUMENT_CATEGORIES.DECISOES;
  } else if (name.includes('contrato') || name.includes('acordo')) {
    return DOCUMENT_CATEGORIES.CONTRATOS;
  } else if (name.includes('pesquisa') || name.includes('research')) {
    return DOCUMENT_CATEGORIES.PESQUISAS;
  } else if (name.includes('análise') || name.includes('analise')) {
    return DOCUMENT_CATEGORIES.ANALISES;
  } else if (name.includes('estratégia') || name.includes('estrategia')) {
    return DOCUMENT_CATEGORIES.ESTRATEGIAS;
  }
  
  return DOCUMENT_CATEGORIES.OUTROS;
};

export function CaseDocumentsOrganizer({ documents, onSelectDocument }: CaseDocumentsOrganizerProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Organize documents by category
  const categorizedDocuments = useMemo(() => {
    const result: Record<string, DocumentMetadata[]> = {
      all: [...documents]
    };
    
    // Group documents by category
    documents.forEach(doc => {
      const category = categorizeDocument(doc);
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(doc);
    });
    
    return result;
  }, [documents]);
  
  // Count documents in each category
  const categoryCount = useMemo(() => {
    return Object.keys(categorizedDocuments).map(category => ({
      name: category,
      count: categorizedDocuments[category]?.length || 0,
      label: category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)
    }));
  }, [categorizedDocuments]);
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Organizados</CardTitle>
        <CardDescription>Documentos classificados por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 overflow-auto flex-nowrap max-w-full">
            {categoryCount.map(category => (
              <TabsTrigger key={category.name} value={category.name}>
                {category.label} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(categorizedDocuments).map(category => (
            <TabsContent key={category} value={category}>
              {categorizedDocuments[category]?.length > 0 ? (
                <div className="space-y-2">
                  {categorizedDocuments[category].map(doc => (
                    <div 
                      key={doc.id} 
                      className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => onSelectDocument(doc)}
                    >
                      <div className="mr-2">
                        {doc.name.endsWith('.pdf') || doc.name.endsWith('.doc') || doc.name.endsWith('.docx') ? (
                          <FileText className="h-5 w-5 text-blue-600" />
                        ) : doc.name.endsWith('.zip') || doc.name.endsWith('.rar') ? (
                          <FileArchive className="h-5 w-5 text-purple-600" />
                        ) : (
                          <FolderOpen className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} • {doc.uploaded_at && 
                            format(new Date(doc.uploaded_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum documento encontrado nesta categoria.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
