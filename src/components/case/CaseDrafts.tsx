
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Check, Download, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocumentDrafting } from '@/hooks/workflow/useDocumentDrafting';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseDraftsProps {
  caseId?: string;
}

export function CaseDrafts({ caseId }: CaseDraftsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("new-draft");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  
  const {
    draftedDocuments,
    latestDraft,
    isLoading,
    draftDocument,
    isDrafting,
    documentTypes,
    selectedDocType,
    setSelectedDocType
  } = useDocumentDrafting(caseId);

  const handleDraftDocument = () => {
    if (!caseId) return;
    draftDocument.mutate({ documentType: selectedDocType });
  };

  const handleViewDraft = (id: string) => {
    setSelectedDraftId(id);
    setSelectedTab("view-draft");
  };

  const selectedDraft = draftedDocuments?.find(doc => doc.id === selectedDraftId) || 
    (draftedDocuments && draftedDocuments.length > 0 ? draftedDocuments[0] : null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Rascunhos de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Rascunhos de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-draft">Criar Rascunho</TabsTrigger>
            <TabsTrigger value="view-draft" disabled={!draftedDocuments || draftedDocuments.length === 0}>
              Visualizar Rascunhos {draftedDocuments && draftedDocuments.length > 0 && `(${draftedDocuments.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-draft" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Selecione o tipo de documento que deseja redigir:
              </p>
              <Select
                value={selectedDocType}
                onValueChange={setSelectedDocType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos de documento</SelectLabel>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleDraftDocument}
                disabled={isDrafting || !caseId}
                className="w-full sm:w-auto"
              >
                {isDrafting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redigindo documento...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Redigir Documento
                  </>
                )}
              </Button>
            </div>

            {!caseId && (
              <div className="flex items-center p-3 text-sm bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 shrink-0" />
                <p className="text-yellow-700">
                  Selecione um caso para redigir documentos.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="view-draft" className="pt-4">
            {draftedDocuments && draftedDocuments.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Rascunhos disponíveis</h3>
                    <div className="space-y-2">
                      {draftedDocuments.map((doc) => (
                        <div 
                          key={doc.id} 
                          onClick={() => handleViewDraft(doc.id)}
                          className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${
                            selectedDraftId === doc.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.createdAt).toLocaleDateString()} · {doc.sections.length} seções
                            </p>
                          </div>
                          {selectedDraftId === doc.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    {selectedDraft && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{selectedDraft.title}</h3>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {selectedDraft.sections.map((section, i) => (
                            <Badge key={i} variant="outline">{section}</Badge>
                          ))}
                        </div>
                        
                        <Card>
                          <ScrollArea className="h-[400px] p-4">
                            <pre className="text-xs whitespace-pre-wrap font-mono">
                              {selectedDraft.content}
                            </pre>
                          </ScrollArea>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Nenhum documento redigido. Crie um novo rascunho primeiro.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
