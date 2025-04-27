
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseDetailsFormProps {
  formData: {
    title: string;
    client: string;
    area_direito?: string;
    description?: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

export function CaseDetailsForm({
  formData,
  onChange,
  onNext
}: CaseDetailsFormProps) {
  const isValid = formData.title && formData.client;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Caso</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Digite o título do caso"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => onChange('client', e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Área do Direito</Label>
          <Select
            value={formData.area_direito}
            onValueChange={(value) => onChange('area_direito', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="civil">Direito Civil</SelectItem>
              <SelectItem value="penal">Direito Penal</SelectItem>
              <SelectItem value="trabalhista">Direito Trabalhista</SelectItem>
              <SelectItem value="administrativo">Direito Administrativo</SelectItem>
              <SelectItem value="tributario">Direito Tributário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Descreva os detalhes do caso"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext} disabled={!isValid}>
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
