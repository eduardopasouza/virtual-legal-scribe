import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'sonner';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { useAuth } from '@/lib/auth/AuthContext';
import { CaseDetailsForm } from '@/components/case/CaseDetailsForm';
import { CaseDocumentsStep } from '@/components/case/CaseDocumentsStep';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationBreadcrumbs } from '@/components/NavigationBreadcrumbs';
import { Steps, Step } from '@/components/ui/steps';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/hooks/workflow';

export default function NovoCaso() {
  const navigate = useNavigate();
  const { createCase } = useCaseOperations();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { initializeWorkflow } = useWorkflow();

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    area_direito: '',
    description: '',
    priority: '',
    complexity: '',
    court: '',
    number: '',
    objective: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      toast.loading("Criando caso...", { id: "creating-case" });

      const newCase = await createCase.mutateAsync({
        ...formData,
        status: 'em_andamento',
        created_by: user?.id
      });

      if (newCase?.id) {
        try {
          await initializeWorkflow.mutateAsync(user?.id);
        } catch (error) {
          console.error("Erro ao inicializar fluxo de trabalho:", error);
        }
      }

      toast.success("Caso criado com sucesso", {
        id: "creating-case",
        description: "Você será redirecionado para a página do caso."
      });

      navigate(`/cases/${newCase.id}`);
    } catch (error: any) {
      console.error("Erro ao criar caso:", error);
      toast.error("Erro ao criar caso", {
        id: "creating-case",
        description: error.message || "Ocorreu um erro ao criar o caso. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/cases');
  };

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('animate-fade-in');
      return () => {
        mainContent.classList.remove('animate-fade-in');
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          <div className="mb-6">
            <NavigationBreadcrumbs />
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight text-evji-primary">Novo Caso</h1>
                <p className="text-muted-foreground mt-1">
                  Preencha as informações necessárias para criar um novo caso.
                </p>
              </div>
            </div>

            <Card className="border-muted/40 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="py-5">
                <Steps currentStep={step} className="mb-0">
                  <Step title="Informações básicas" description="Detalhes do caso" />
                  <Step title="Documentos" description="Anexar arquivos" />
                </Steps>
              </CardContent>
            </Card>

            <div className="transition-all duration-300 animate-fade-in">
              {step === 1 ? (
                <CaseDetailsForm
                  formData={formData}
                  onChange={handleChange}
                  onNext={() => {
                    setStep(2);
                    toast.info("Próximo passo", { description: "Complete o cadastro anexando os documentos" });
                  }}
                />
              ) : (
                <CaseDocumentsStep
                  onBack={() => setStep(1)}
                  onFinish={handleSubmit}
                  onFileSelect={handleFileSelect}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
