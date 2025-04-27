
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { useDocuments } from '@/hooks/useDocuments';

const AREAS_DIREITO = [
  'Civil',
  'Penal',
  'Trabalhista',
  'Tributário',
  'Administrativo',
  'Empresarial',
  'Consumidor',
  'Ambiental',
];

export default function NovoCaso() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCase } = useCaseOperations();
  const { uploadDocument } = useDocuments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    area_direito: '',
    description: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the case first
      const newCase = await createCase.mutateAsync({
        ...formData,
        status: 'em_andamento'
      });

      // Upload all documents
      if (files.length > 0) {
        await Promise.all(files.map(file => uploadDocument(file)));
      }

      toast({
        title: "Caso criado com sucesso",
        description: "Você será redirecionado para a página do caso.",
      });

      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      toast({
        title: "Erro ao criar caso",
        description: "Ocorreu um erro ao criar o caso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Novo Caso</h1>
              <p className="text-muted-foreground">
                Preencha os dados básicos do caso e faça upload dos documentos iniciais.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="title">Título do Caso</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleChange('client', e.target.value)}
                    required
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="area">Área do Direito</Label>
                  <Select 
                    value={formData.area_direito}
                    onValueChange={(value) => handleChange('area_direito', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS_DIREITO.map((area) => (
                        <SelectItem key={area} value={area.toLowerCase()}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documentos</Label>
                  <DocumentUploader 
                    caseId={undefined}
                    onSuccess={handleFileSelect}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Criando caso...' : 'Salvar e iniciar triagem'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
