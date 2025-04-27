
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Globe, Layers, FileDigit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdvancedLayersAnalysis } from '@/hooks/workflow';
import { Skeleton } from '@/components/ui/skeleton';

interface CaseAdvancedAnalysisProps {
  caseId: string;
}

export function CaseAdvancedAnalysis({ caseId }: CaseAdvancedAnalysisProps) {
  const {
    latestAnalysis,
    isLoading,
    executeAdvancedAnalysis,
    isAnalyzing,
    specialtyTypes,
    selectedSpecialty,
    setSelectedSpecialty
  } = useAdvancedLayersAnalysis(caseId);

  const getSpecialtyIcon = (type: string) => {
    switch (type) {
      case 'constitutional':
        return <BookOpen className="h-5 w-5" />;
      case 'international':
        return <Globe className="h-5 w-5" />;
      case 'interdisciplinary':
        return <Layers className="h-5 w-5" />;
      case 'technical':
        return <FileDigit className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getSpecialtyName = (type: string) => {
    switch (type) {
      case 'constitutional':
        return 'Análise Constitucional';
      case 'international':
        return 'Direito Internacional';
      case 'interdisciplinary':
        return 'Aspectos Interdisciplinares';
      case 'technical':
        return 'Documentos Técnicos';
      default:
        return 'Análise Especializada';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }

    if (!latestAnalysis) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            Nenhuma análise avançada foi realizada ainda. Selecione um tipo de análise e clique no botão para iniciar.
          </p>
        </div>
      );
    }

    // Render different content based on the specialty type
    switch (selectedSpecialty) {
      case 'constitutional':
        return renderConstitutionalAnalysis();
      case 'international':
        return renderInternationalAnalysis();
      case 'interdisciplinary':
        return renderInterdisciplinaryAnalysis();
      case 'technical':
        return renderTechnicalAnalysis();
      default:
        return renderConstitutionalAnalysis();
    }
  };

  const renderConstitutionalAnalysis = () => {
    const data = latestAnalysis;
    if (!data || !data.constitutionalPrinciples) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Princípios Constitucionais Aplicáveis</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.constitutionalPrinciples.map((principle: string, i: number) => (
              <li key={i} className="text-muted-foreground">{principle}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Artigos Relevantes</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.relevantArticles.map((article: string, i: number) => (
              <li key={i} className="text-muted-foreground">{article}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Precedentes Constitucionais</h3>
          <div className="mt-1 space-y-2">
            {data.constitutionalPrecedents.map((precedent: any, i: number) => (
              <div key={i} className="text-sm bg-muted/50 p-2 rounded-md">
                <div className="font-medium">{precedent.court} - {precedent.number}</div>
                <div className="text-muted-foreground">{precedent.summary}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Análise Constitucional</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.constitutionalAnalysis}</p>
        </div>
      </div>
    );
  };

  const renderInternationalAnalysis = () => {
    const data = latestAnalysis;
    if (!data || !data.internationalTreaties) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Tratados Internacionais Aplicáveis</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.internationalTreaties.map((treaty: string, i: number) => (
              <li key={i} className="text-muted-foreground">{treaty}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Princípios de Direito Internacional</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.internationalPrinciples.map((principle: string, i: number) => (
              <li key={i} className="text-muted-foreground">{principle}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Casos Relevantes</h3>
          <div className="mt-1 space-y-2">
            {data.relevantCases.map((relevantCase: any, i: number) => (
              <div key={i} className="text-sm bg-muted/50 p-2 rounded-md">
                <div className="font-medium">{relevantCase.court}</div>
                <div className="font-medium">{relevantCase.case}</div>
                <div className="text-muted-foreground">{relevantCase.relevance}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Análise de Direito Internacional</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.analysis}</p>
        </div>
      </div>
    );
  };

  const renderInterdisciplinaryAnalysis = () => {
    const data = latestAnalysis;
    if (!data || !data.economicAspects) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Aspectos Econômicos</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.economicAspects}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Implicações Sociais</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.socialImplications}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Considerações Ambientais</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.environmentalConsiderations}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Recomendações</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.recommendations.map((recommendation: string, i: number) => (
              <li key={i} className="text-muted-foreground">{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderTechnicalAnalysis = () => {
    const data = latestAnalysis;
    if (!data || !data.documentsSummary) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Resumo dos Documentos Técnicos</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.documentsSummary}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Principais Conclusões Técnicas</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.keyFindings.map((finding: string, i: number) => (
              <li key={i} className="text-muted-foreground">{finding}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Contradições Técnicas Identificadas</h3>
          <ul className="list-disc list-inside mt-1 text-sm">
            {data.technicalContradictions.map((contradiction: string, i: number) => (
              <li key={i} className="text-muted-foreground">{contradiction}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">Implicações Jurídicas</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.legalImplications}</p>
        </div>
      </div>
    );
  };

  const handleExecuteAnalysis = () => {
    executeAdvancedAnalysis.mutate({ specialtyType: selectedSpecialty });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {getSpecialtyIcon(selectedSpecialty)}
          Análise de Camadas Avançadas
        </CardTitle>
        <CardDescription>
          Análise especializada de aspectos constitucionais, internacionais, interdisciplinares ou técnicos do caso
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={selectedSpecialty} 
          onValueChange={(value) => setSelectedSpecialty(value as any)}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4">
            {specialtyTypes.map(type => (
              <TabsTrigger key={type} value={type} className="flex items-center gap-1">
                {getSpecialtyIcon(type)}
                <span className="hidden md:inline">{getSpecialtyName(type).split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{getSpecialtyName(selectedSpecialty)}</h3>
              <Button 
                onClick={handleExecuteAnalysis} 
                disabled={isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>Realizar Análise</>
                )}
              </Button>
            </div>
            
            <div>
              {renderContent()}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
