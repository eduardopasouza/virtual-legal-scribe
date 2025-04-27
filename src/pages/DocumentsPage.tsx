
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DocumentMetadata } from '@/hooks/useDocuments';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { Search, Filter, RefreshCcw, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentMetadata[]>([]);
  
  const {
    loadingFiles,
    processingFiles,
    refreshing,
    fetchDocuments,
    handleDownload,
    handleProcessDocument,
    handleDeleteDocument,
    handleUploadSuccess
  } = useDocumentManager();

  React.useEffect(() => {
    fetchDocuments().then(setDocuments);
  }, []);

  React.useEffect(() => {
    if (!documents) return;
    
    let filtered = [...documents];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all' && selectedCategory) {
      filtered = filtered.filter(doc => doc.document_type === selectedCategory);
    }
    
    // Apply tab filter
    if (activeTab === 'processed') {
      filtered = filtered.filter(doc => doc.has_extracted_text);
    } else if (activeTab === 'unprocessed') {
      filtered = filtered.filter(doc => !doc.has_extracted_text);
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedCategory, activeTab]);

  const handleRefresh = async () => {
    const docs = await fetchDocuments();
    setDocuments(docs || []);
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-evji-primary">Repositório de Documentos</h1>
            
            <DocumentUploader onSuccess={handleUploadSuccess} allowMultiple={true} />
            
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Documentos</CardTitle>
                    <CardDescription>
                      Todos os documentos disponíveis no sistema
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row md:items-center gap-2 w-full md:w-auto">
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
                        {DOCUMENT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      {refreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="processed">Processados</TabsTrigger>
                    <TabsTrigger value="unprocessed">Não Processados</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <DocumentList 
                      documents={filteredDocuments}
                      loadingFiles={loadingFiles}
                      processingFiles={processingFiles}
                      onDownload={handleDownload}
                      onDelete={handleDeleteDocument}
                      onProcess={handleProcessDocument}
                    />
                  </TabsContent>
                  <TabsContent value="processed" className="mt-4">
                    <DocumentList 
                      documents={filteredDocuments}
                      loadingFiles={loadingFiles}
                      processingFiles={processingFiles}
                      onDownload={handleDownload}
                      onDelete={handleDeleteDocument}
                      onProcess={handleProcessDocument}
                    />
                  </TabsContent>
                  <TabsContent value="unprocessed" className="mt-4">
                    <DocumentList 
                      documents={filteredDocuments}
                      loadingFiles={loadingFiles}
                      processingFiles={processingFiles}
                      onDownload={handleDownload}
                      onDelete={handleDeleteDocument}
                      onProcess={handleProcessDocument}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

const DocumentList = ({ 
  documents, 
  loadingFiles, 
  processingFiles, 
  onDownload, 
  onDelete, 
  onProcess 
}: { 
  documents: DocumentMetadata[];
  loadingFiles: { [key: string]: boolean };
  processingFiles: { [key: string]: boolean };
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
  onProcess?: (doc: DocumentMetadata) => Promise<string | null>;
}) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum documento encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          isLoading={loadingFiles[doc.id!]} 
          isProcessing={processingFiles[doc.id!]}
          onDownload={onDownload}
          onDelete={onDelete}
          onProcess={onProcess}
        />
      ))}
    </div>
  );
};

const DocumentCard = ({ 
  document, 
  isLoading, 
  isProcessing, 
  onDownload, 
  onDelete, 
  onProcess 
}: { 
  document: DocumentMetadata;
  isLoading?: boolean;
  isProcessing?: boolean;
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
  onProcess?: (doc: DocumentMetadata) => Promise<string | null>;
}) => {
  const getDocumentTypeDisplay = (type?: string) => {
    switch (type) {
      case 'petition': return 'Petição';
      case 'contract': return 'Contrato';
      case 'evidence': return 'Prova';
      case 'proceeding': return 'Processo';
      case 'legal-research': return 'Pesquisa';
      case 'court-decision': return 'Decisão';
      default: return type || 'Outros';
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium truncate">{document.name}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>{getDocumentTypeDisplay(document.document_type)}</span>
          <span>{formatFileSize(document.size)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs space-y-3 pb-3">
        <div className="flex justify-between text-muted-foreground">
          <span>Enviado em:</span>
          <span>{formatDate(document.uploaded_at)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Status:</span>
          <span>{document.has_extracted_text ? 'Processado' : 'Não processado'}</span>
        </div>
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            onClick={() => onDownload(document)}
            disabled={isLoading || !document.file_path}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Baixar'}
          </Button>
          {onProcess && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onProcess(document)}
              disabled={isProcessing || document.has_extracted_text}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Processar'}
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(document)}
            disabled={isLoading || isProcessing}
          >
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsPage;
