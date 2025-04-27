
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentUploader() {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Formato Inválido",
          description: "Por favor, envie apenas arquivos PDF.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Formato Inválido",
          description: "Por favor, envie apenas arquivos PDF.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para enviar.",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria a lógica para enviar o arquivo
    toast({
      title: "Documento Enviado",
      description: "Seu documento foi enviado com sucesso e está sendo processado.",
    });
    
    setSelectedFile(null);
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Documento</CardTitle>
        <CardDescription>
          Envie um documento jurídico para análise pelos agentes da EVJI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          } ${selectedFile ? 'bg-secondary/50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Arraste e solte seu PDF aqui, ou
                </p>
                <Label 
                  htmlFor="file-upload" 
                  className="relative cursor-pointer text-sm text-primary hover:text-primary/80"
                >
                  <span>selecione um arquivo</span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas arquivos PDF são aceitos.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearSelectedFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSubmit} disabled={!selectedFile}>
          Enviar para Análise
        </Button>
      </CardFooter>
    </Card>
  );
}
