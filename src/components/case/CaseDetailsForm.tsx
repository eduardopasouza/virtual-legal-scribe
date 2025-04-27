
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
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
    priority?: string;
    complexity?: string;
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
      <CardHeader className="pb-3">
        <CardTitle>Detalhes do Caso</CardTitle>
        <CardDescription>
          Preencha as informações básicas do caso para começar. Você poderá adicionar mais detalhes e interagir com nossos agentes posteriormente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            Título do Caso
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Um título claro e conciso que descreva o caso
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Digite o título do caso"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client" className="flex items-center gap-2">
            Cliente
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Nome do cliente associado a este caso
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => onChange('client', e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area" className="flex items-center gap-2">
            Área do Direito
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Selecione a área jurídica relacionada ao caso
              </TooltipContent>
            </Tooltip>
          </Label>
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
              <SelectItem value="empresarial">Direito Empresarial</SelectItem>
              <SelectItem value="consumidor">Direito do Consumidor</SelectItem>
              <SelectItem value="ambiental">Direito Ambiental</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center gap-2">
              Prioridade
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Defina o nível de urgência deste caso
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => onChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complexity" className="flex items-center gap-2">
              Complexidade
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Indique o nível de complexidade do caso
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select
              value={formData.complexity}
              onValueChange={(value) => onChange('complexity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a complexidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples">Simples</SelectItem>
                <SelectItem value="moderada">Moderada</SelectItem>
                <SelectItem value="complexa">Complexa</SelectItem>
                <SelectItem value="muito_complexa">Muito Complexa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            Descrição
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Descreva os detalhes relevantes do caso
              </TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Descreva os detalhes do caso. Você poderá adicionar mais informações e documentos na próxima etapa."
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
