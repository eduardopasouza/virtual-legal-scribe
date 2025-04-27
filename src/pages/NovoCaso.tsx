
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { useAuth } from '@/lib/auth/AuthContext';
import { CaseDetailsForm } from '@/components/case/CaseDetailsForm';
import { CaseDocumentsStep } from '@/components/case/CaseDocumentsStep';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationBreadcrumbs } from '@/components/NavigationBreadcrumbs';
import { Steps, Step } from '@/components/ui/steps';

export default function NovoCaso() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCase } = useCaseOperations();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    area_direito: '',
    description: '',
    priority: '',
    complexity: '',
    court: '',
    number: '',
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
      const newCase = await createCase.mutateAsync({
        ...formData,
        status: 'em_andamento',
        created_by: user?.id
      });

      toast({
        title: "Caso criado com sucesso",
        description: "Você será redirecionado para a página do caso.",
      });

      navigate(`/cases/${newCase.id}`);
    } catch (error: any) {
      console.error("Erro ao criar caso:", error);
      toast({
        title: "Erro ao criar caso",
        description: error.message || "Ocorreu um erro ao criar o caso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-4">
            <NavigationBreadcrumbs />
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-evji-primary">Novo Caso</h1>
                <p className="text-muted-foreground mt-1">
                  Preencha as informações necessárias para criar um novo caso.
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <Card className="border-muted/40">
              <CardContent className="py-4">
                <Steps currentStep={step} className="mb-0">
                  <Step title="Informações básicas" />
                  <Step title="Documentos" />
                </Steps>
              </CardContent>
            </Card>

            {step === 1 ? (
              <CaseDetailsForm
                formData={formData}
                onChange={handleChange}
                onNext={() => setStep(2)}
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
        </main>
      </div>
    </div>
  );
}
