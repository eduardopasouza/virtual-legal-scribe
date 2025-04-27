
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface CaseFormData {
  title: string;
  client: string;
  area_direito: string;
  description: string;
}

interface CaseDetailsFormProps {
  formData: CaseFormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

export function CaseDetailsForm({ formData, onChange, onNext }: CaseDetailsFormProps) {
  const isFormValid = formData.title && formData.client && formData.area_direito;

  return (
    <div className="space-y-8">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="title">Título do Caso</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          required
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="client">Cliente</Label>
        <Input
          id="client"
          value={formData.client}
          onChange={(e) => onChange('client', e.target.value)}
          required
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="area">Área do Direito</Label>
        <Select 
          value={formData.area_direito}
          onValueChange={(value) => onChange('area_direito', value)}
        >
          <SelectTrigger id="area">
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
          onChange={(e) => onChange('description', e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <Button 
        onClick={onNext}
        disabled={!isFormValid}
        className="w-full"
      >
        Próximo
      </Button>
    </div>
  );
}
