
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { Clock, FileText, MessageSquare, Calendar, Users } from 'lucide-react';
import { CaseHeader } from '@/components/case/CaseHeader';
import { CaseInformation } from '@/components/case/CaseInformation';
import { CaseDocuments } from '@/components/case/CaseDocuments';
import { CaseActivities } from '@/components/case/CaseActivities';
import { CaseDeadlines } from '@/components/case/CaseDeadlines';
import { CasePeople } from '@/components/case/CasePeople';

const mockCaseData = {
  id: '1',
  title: 'Ação de Indenização por Danos Morais',
  client: 'Maria Silva',
  status: 'Em andamento',
  createdAt: new Date('2024-04-10'),
  type: 'Cível',
  number: '0123456-78.2024.8.26.0100',
  court: '3ª Vara Cível de São Paulo',
  mainAgent: 'Estrategista',
  description: 'Caso de indenização por danos morais devido a publicação indevida de dados pessoais da cliente em plataforma digital.',
  activities: [
    { 
      id: '1', 
      agent: 'Recepcionista', 
      action: 'Recebeu os documentos e abriu o caso', 
      date: new Date('2024-04-10T09:30:00') 
    },
    { 
      id: '2', 
      agent: 'Analisador', 
      action: 'Extraiu informações dos documentos', 
      date: new Date('2024-04-10T10:15:00') 
    },
    { 
      id: '3', 
      agent: 'Estrategista', 
      action: 'Definiu estratégia para o caso', 
      date: new Date('2024-04-11T14:20:00') 
    },
    { 
      id: '4', 
      agent: 'Pesquisador', 
      action: 'Localizou 3 jurisprudências relevantes', 
      date: new Date('2024-04-12T11:45:00') 
    }
  ],
  deadlines: [
    { 
      id: '1', 
      description: 'Prazo para contestação', 
      date: new Date('2024-05-05'), 
      status: 'pendente' 
    },
    { 
      id: '2', 
      description: 'Audiência de conciliação', 
      date: new Date('2024-06-15'), 
      status: 'pendente' 
    }
  ]
};

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  
  // Using the mock data for now
  const caseData = mockCaseData;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <CaseHeader 
              title={caseData.title}
              type={caseData.type}
              status={caseData.status}
              createdAt={caseData.createdAt}
            />
            
            <CaseInformation 
              number={caseData.number}
              court={caseData.court}
              client={caseData.client}
              mainAgent={caseData.mainAgent}
              description={caseData.description}
            />
            
            <Tabs defaultValue="timeline" className="mt-6">
              <TabsList>
                <TabsTrigger value="timeline">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="activities">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Atividades
                </TabsTrigger>
                <TabsTrigger value="deadlines">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prazos
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Users className="h-4 w-4 mr-2" />
                  Pessoas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="mt-4">
                <WorkflowTimeline />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <CaseDocuments caseId={caseId} />
              </TabsContent>
              
              <TabsContent value="activities" className="mt-4">
                <CaseActivities activities={caseData.activities} />
              </TabsContent>
              
              <TabsContent value="deadlines" className="mt-4">
                <CaseDeadlines deadlines={caseData.deadlines} />
              </TabsContent>
              
              <TabsContent value="people" className="mt-4">
                <CasePeople />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaseDetails;
