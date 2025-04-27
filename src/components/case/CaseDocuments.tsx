
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Paperclip, Trash2, Download, Loader2, Eye, Search, Tag, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDocuments, DocumentMetadata } from '@/hooks/useDocuments';
import { DocumentUploader } from '@/components/DocumentUploader';
import { DocumentPreview } from '@/components/DocumentPreview';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CaseDocumentsProps {
  caseId?: string;
}

// Tags/categorias para documentos
const DOCUMENT_CATEGORIES = [
  { value: 'all', label: 'Todos' },
  { value: 'petition', label: 'Petições' },
  { value: 'contract', label: 'Contratos' },
  { value: 'evidence', label: 'Provas' },
  { value: 'proceeding', label: 'Processos' },
  { value: 'legal-research', label: 'Pesquisas' },
  { value: 'court-decision', label: 'Decisões' },
  { value: 'other', label: 'Outros' }
];

export function CaseDocuments({ caseId }: CaseDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentMetadata[]>([]);
  const { listDocuments, getDocumentUrl, deleteDocument } = useDocuments(caseId);
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentMetadata | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDocuments = async () => {
    if (caseId) {
      setRefreshing(true);
      const docs = await listDocuments(caseId);
      setDocuments(docs);
      setFilteredDocuments(docs);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [caseId]);

  // Aplicar filtros quando os estados de filtro mudarem
  useEffect(() => {
    let results = documents;
    
    // Aplicar filtro de pesquisa
    if (searchTerm) {
      results = results.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de categoria
    if (selectedCategory !== 'all') {
      // Neste exemplo, estamos usando a extensão do arquivo como uma simulação da categoria
      // Em um sistema real, você teria uma propriedade de categoria no documento
      const categoryMapping: {[key: string]: string[]} = {
        'petition': ['.doc', '.docx', '.pdf'],
        'contract': ['.pdf', '.docx'],
        'evidence': ['.jpg', '.png', '.pdf', '.mp4'],
        'proceeding': ['.pdf'],
        'legal-research': ['.pdf', '.docx', '.txt'],
        'court-decision': ['.pdf'],
        'other': ['.xlsx', '.pptx', '.zip']
      };
      
      const extensions = categoryMapping[selectedCategory] || [];
      results = results.filter(doc => 
        extensions.some(ext => doc.name.toLowerCase().endsWith(ext))
      );
    }
    
    setFilteredDocuments(results);
  }, [searchTerm, selectedCategory, documents]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDownload = async (doc: DocumentMetadata) => {
    if (!doc.file_path) return;
    
    setLoadingFiles(prev => ({ ...prev, [doc.id!]: true }));
    
    try {
      const url = await getDocumentUrl(doc.file_path);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      toast({
        title: "Erro ao baixar documento",
        description: "Não foi possível gerar o link para download",
        variant: "destructive"
      });
    } finally {
      setLoadingFiles(prev => ({ ...prev, [doc.id!]: false }));
    }
  };

  const handleDeleteClick = (doc: DocumentMetadata) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete && documentToDelete.id && documentToDelete.file_path) {
      const success = await deleteDocument(documentToDelete.id, documentToDelete.file_path);
      if (success) {
        fetchDocuments();
        if (caseId) {
          queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
        }
      }
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
    if (caseId) {
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
    }
  };
  
  // Simular a adição de uma tag/categoria a um documento
  const handleAddTag = (doc: DocumentMetadata, category: string) => {
    toast({
      title: "Tag adicionada",
      description: `Documento categorizado como "${category}"`,
    });
    
    // Em uma implementação real, você salvaria esta tag no banco de dados
    // e então re-carregaria os documentos
  };

  return (
    <div className="space-y-6">
      <DocumentUploader caseId={caseId} onSuccess={handleUploadSuccess} />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Documentos do Caso</CardTitle>
              <CardDescription>
                Todos os documentos relacionados a este caso
              </CardDescription>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar documentos..."
                  className="w-full sm:w-[200px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {refreshing ? (
              <div className="text-center p-6">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Carregando documentos...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                {searchTerm || selectedCategory !== 'all' ? 
                  "Nenhum documento corresponde aos filtros aplicados." :
                  "Nenhum documento encontrado para este caso."}
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {formatFileSize(doc.size)} • {
                            doc.uploaded_at 
                              ? format(new Date(doc.uploaded_at), 'dd/MM/yyyy', { locale: ptBR })
                              : 'Data desconhecida'
                          }
                        </span>
                        
                        {/* Exemplo de como mostrar tags/categorias */}
                        <div className="flex gap-1">
                          {doc.name.toLowerCase().endsWith('.pdf') && (
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">PDF</Badge>
                          )}
                          {doc.name.toLowerCase().includes('contrato') && (
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-blue-50 text-blue-600 border-blue-200">Contrato</Badge>
                          )}
                          {doc.name.toLowerCase().includes('petição') && (
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-green-50 text-green-600 border-green-200">Petição</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Botão para visualizar documento */}
                    {doc.file_path && (
                      <DocumentPreview 
                        filePath={doc.file_path} 
                        fileName={doc.name} 
                        fileType={doc.type} 
                        fileId={doc.id || ''} 
                      />
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={loadingFiles[doc.id!] || !doc.file_path}
                    >
                      {loadingFiles[doc.id!] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-1" />
                      )}
                      <span className="hidden sm:inline">Baixar</span>
                    </Button>
                    
                    {/* Menu dropdown para tags (em uma implementação real seria um componente dropdown) */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAddTag(doc, 'Petição')}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Tags</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive mr-1" />
                      <span className="hidden sm:inline">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o documento "{documentToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
