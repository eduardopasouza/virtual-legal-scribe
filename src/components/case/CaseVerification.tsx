
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocumentVerification } from '@/hooks/workflow';
import { AlertTriangle, CheckCircle, ClipboardCheck, FileWarning, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDocumentDrafting } from '@/hooks/workflow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CaseVerificationProps {
  caseId?: string;
}

export function CaseVerification({ caseId }: CaseVerificationProps) {
  const {
    verificationResults,
    latestVerification,
    isLoading,
    verifyDocument,
    isVerifying
  } = useDocumentVerification(caseId);

  const {
    draftedDocuments,
    isLoading: isLoadingDocuments
  } = useDocumentDrafting(caseId);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVerify = () => {
    verifyDocument.mutate({ documentId: selectedDocumentId || undefined });
  };

  if (isLoading || isLoadingDocuments) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Verificação de Conformidade
          </CardTitle>
          <CardDescription>
            Verifique a conformidade dos documentos jurídicos, incluindo requisitos formais,
            conformidade legal, citações e coerência com os objetivos do caso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {draftedDocuments && draftedDocuments.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Selecione um documento para verificar</label>
                  <Select
                    value={selectedDocumentId}
                    onValueChange={setSelectedDocumentId}
                    disabled={isVerifying}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um documento..." />
                    </SelectTrigger>
                    <SelectContent>
                      {draftedDocuments.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.title} - {formatDate(doc.createdAt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleVerify} 
                  disabled={!selectedDocumentId || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando documento...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Verificar Documento
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhum documento disponível</AlertTitle>
                <AlertDescription>
                  Para verificação, primeiro crie um documento usando o Redator Jurídico.
                </AlertDescription>
              </Alert>
            )}

            {verificationResults && verificationResults.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-lg font-medium mb-3">Histórico de Verificações</h3>
                  <div className="space-y-4">
                    {verificationResults.map((verification, index) => (
                      <Card key={verification.id} className="overflow-hidden">
                        <div className={`h-1.5 w-full ${verification.result.criterios?.formalRequirements ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {verification.documentTitle}
                            </CardTitle>
                            <Badge variant={verification.result.criterios?.formalRequirements ? "outline" : "secondary"}>
                              {verification.result.criterios?.formalRequirements ? 
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> : 
                                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />}
                              {verification.result.criterios?.formalRequirements ? 'Aprovado' : 'Com ressalvas'}
                            </Badge>
                          </div>
                          <CardDescription>
                            Verificação realizada em {formatDate(verification.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-1">Critérios verificados:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {verification.result.criterios && Object.entries(verification.result.criterios).map(([key, value]) => (
                                  <div key={key} className="flex items-center gap-1">
                                    {value ? 
                                      <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : 
                                      <FileWarning className="h-3.5 w-3.5 text-amber-500" />}
                                    <span>
                                      {key === 'formalRequirements' && 'Requisitos Formais'}
                                      {key === 'legalCompliance' && 'Conformidade Legal'}
                                      {key === 'citations' && 'Citações e Referências'}
                                      {key === 'logicalCoherence' && 'Coerência Lógica'}
                                      {key === 'alignmentWithObjectives' && 'Alinhamento com Objetivos'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {verification.result.recomendacoes && verification.result.recomendacoes.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-1">Recomendações:</h4>
                                <ul className="list-disc list-inside">
                                  {verification.result.recomendacoes.map((rec: string, idx: number) => (
                                    <li key={idx} className="text-muted-foreground">{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
