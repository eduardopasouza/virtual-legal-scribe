
import React from 'react';
import { AgentCoordinator } from '@/components/agent/AgentCoordinator';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { Alert, WorkflowStage as CaseWorkflowStage } from '@/types/case';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mapWorkflowStatus } from '@/types/workflow';
import { CaseStrategy } from './CaseStrategy';
import { CaseFacts } from './CaseFacts';
import { CaseRules } from './CaseRules';
import { CaseLegalIssues } from './CaseLegalIssues';
import { CaseArgumentsAnalysis } from './CaseArgumentsAnalysis';
import { useFactsAnalysis } from '@/hooks/workflow';
import { LegalIssue, ArgumentsAnalysisData, StrategyData, RulesData } from './types';

interface CaseSummaryTabProps {
  caseId: string;
  workflowStages: CaseWorkflowStage[];
  alerts: Alert[];
  objective?: string;
}

export function CaseSummaryTab({ 
  caseId, 
  workflowStages, 
  alerts,
  objective 
}: CaseSummaryTabProps) {
  const { factsAnalysis, isLoading: isLoadingFacts } = useFactsAnalysis(caseId);
  
  const mappedWorkflowStages = workflowStages.map(stage => ({
    ...stage,
    status: mapWorkflowStatus(stage.status)
  }));

  // Mock strategy data for demonstration (in a real app, this would come from the API)
  const mockStrategyData: StrategyData = {
    mainThesis: 'Abordagem baseada na violação contratual com foco em restituição econômica',
    objectives: [
      'Demonstrar descumprimento dos termos contratuais',
      'Estabelecer nexo causal entre violação e danos'
    ],
    risks: [
      'Documentação insuficiente para comprovar danos',
      'Possível alegação de força maior pela contraparte'
    ],
    recommendations: [
      'Priorizar argumentos de boa-fé contratual',
      'Focar em jurisprudência favorável identificada na pesquisa'
    ],
    currentPhase: 'intermediate'
  };

  // Mock data for rules section (in a real app, this would come from the API)
  const mockRulesData: RulesData = {
    relevantLegislation: [
      {
        name: 'Código Civil',
        articles: ['Art. 422 - Princípio da boa-fé contratual', 'Art. 475 - Direito de resolução por inadimplemento']
      },
      {
        name: 'Código de Defesa do Consumidor',
        articles: ['Art. 39 - Práticas abusivas', 'Art. 51 - Cláusulas abusivas']
      }
    ],
    jurisprudence: [
      'REsp 1.735.645/SP - Superior Tribunal de Justiça - Proteção contra cláusulas abusivas',
      'REsp 1.631.278/PR - Superior Tribunal de Justiça - Dever de informação e transparência'
    ],
    doctrines: [
      'Princípio da função social do contrato',
      'Teoria do adimplemento substancial'
    ]
  };

  // Mock data for legal issues (in a real app, this would come from the API)
  const mockLegalIssuesData: LegalIssue[] = [
    {
      id: 1,
      issue: 'Possível nulidade de cláusulas contratuais abusivas',
      description: 'Identificação de potenciais cláusulas leoninas no contrato que podem ser consideradas inválidas.',
      priority: 'high',
      relatedFacts: ['Cláusula 3.2 do contrato', 'E-mail datado de 12/04/2023']
    },
    {
      id: 2,
      issue: 'Caracterização de danos materiais e morais',
      description: 'Avaliação da extensão dos danos causados e possibilidade de reparação.',
      priority: 'medium',
      relatedFacts: ['Laudo técnico', 'Comprovantes de pagamento']
    },
    {
      id: 3,
      issue: 'Responsabilidade por atraso na entrega',
      description: 'Determinação de culpabilidade e excludentes de responsabilidade no caso de atraso.',
      priority: 'high',
      relatedFacts: ['Cronograma acordado', 'Notificações de atraso']
    }
  ];

  // Mock data for arguments analysis (in a real app, this would come from the API)
  const mockArgumentsAnalysisData: ArgumentsAnalysisData = {
    plaintiffArguments: [
      {
        argument: 'Violação contratual por entrega de produto diferente do especificado',
        strength: 'strong',
        supportingEvidence: ['Especificações técnicas do contrato', 'Laudo pericial']
      },
      {
        argument: 'Danos materiais decorrentes da paralisação da atividade empresarial',
        strength: 'medium',
        supportingEvidence: ['Relatório financeiro', 'Testemunhos']
      }
    ],
    defendantArguments: [
      {
        argument: 'Alteração do projeto foi concordada verbalmente entre as partes',
        strength: 'weak',
        counterEvidence: ['Ausência de documentação formal', 'E-mails rejeitando alterações']
      },
      {
        argument: 'Força maior devido a problemas de fornecimento',
        strength: 'medium',
        counterEvidence: ['Ausência de notificação tempestiva', 'Jurisprudência contrária']
      }
    ],
    keyDisputes: [
      'Existência de consentimento para alteração do projeto',
      'Nexo causal entre o descumprimento e os danos alegados',
      'Quantificação dos danos materiais'
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-visible">
      <div className="lg:col-span-8 space-y-6">
        {objective && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Objetivo do Caso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{objective}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Facts Analysis Section */}
        <CaseFacts 
          analysisData={factsAnalysis} 
          isLoading={isLoadingFacts} 
          iconColor="text-gray-600"
        />
        
        <CaseRules 
          rulesData={mockRulesData}
          iconColor="text-gray-600"
        />
        
        <CaseLegalIssues 
          issuesData={mockLegalIssuesData}
          iconColor="text-gray-600"
        />
        
        <CaseArgumentsAnalysis 
          analysisData={mockArgumentsAnalysisData}
          iconColor="text-gray-600"
        />
        
        <CaseStrategy 
          strategyData={mockStrategyData}
          iconColor="text-gray-600"
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Fluxo do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseTimeline stages={workflowStages} />
          </CardContent>
        </Card>
        
        <AgentCoordinator caseId={caseId} workflowStages={workflowStages} />
        
        <Separator className="my-6" />
        
        {alerts.length > 0 && <CaseAlerts alerts={alerts} />}
      </div>
      
      <div className="lg:col-span-4">
        {/* This column is deliberately empty to maintain the layout */}
      </div>
    </div>
  );
}
