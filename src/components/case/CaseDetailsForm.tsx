
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
import { Separator } from "@/components/ui/separator";

interface CaseDetailsFormProps {
  formData: {
    title: string;
    client: string;
    area_direito?: string;
    description?: string;
    priority?: string;
    complexity?: string;
    court?: string;
    number?: string;
    objective?: string;
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
          Preencha as informações básicas do caso para começar. Você poderá adicionar mais detalhes e documentos na próxima etapa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Principais - Agrupamento lógico dos campos mais importantes */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Informações Principais</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                Título do Caso <span className="text-red-500">*</span>
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
                Cliente <span className="text-red-500">*</span>
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
              <Label htmlFor="objective" className="flex items-center gap-2">
                Objetivo do Caso
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Qual o objetivo principal a ser alcançado com este caso
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                id="objective"
                value={formData.objective || ''}
                onChange={(e) => onChange('objective', e.target.value)}
                placeholder="Descreva o objetivo principal deste caso (ex: Obter indenização, reconhecer direito, resolver disputa)"
                rows={2}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Detalhes do Processo - Agrupamento lógico de informações processuais */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Detalhes do Processo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number" className="flex items-center gap-2">
                Número do Processo
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Número do processo judicial (se aplicável)
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="number"
                value={formData.number || ''}
                onChange={(e) => onChange('number', e.target.value)}
                placeholder="Número do processo (se houver)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court" className="flex items-center gap-2">
                Tribunal/Vara
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Tribunal ou vara onde o processo está tramitando
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="court"
                value={formData.court || ''}
                onChange={(e) => onChange('court', e.target.value)}
                placeholder="Tribunal ou vara"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Classificação - Agrupamento de campos relacionados à natureza do caso */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Classificação do Caso</h3>
          <div className="space-y-4">
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
          </div>
        </div>

        <Separator />

        {/* Descrição - Seção final para detalhes textuais */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Detalhes Adicionais</h3>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              Descrição do Caso
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
              value={formData.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Descreva os detalhes do caso. Você poderá adicionar mais informações e documentos na próxima etapa."
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onNext} 
            disabled={!isValid} 
            className="min-w-[120px]"
          >
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
