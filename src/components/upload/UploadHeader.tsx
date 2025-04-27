
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UploadHeaderProps {
  optional?: boolean;
}

export function UploadHeader({ optional }: UploadHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>Upload de Documento</CardTitle>
      <CardDescription className="space-y-2">
        {optional && (
          <p className="text-muted-foreground">
            Você pode pular esta etapa e anexar documentos mais tarde.
          </p>
        )}
        Envie um documento jurídico para análise pelos agentes da EVJI.
        <div className="text-xs text-muted-foreground mt-1">
          Formatos suportados: PDF, DOCX • Tamanho máximo: 10MB
        </div>
      </CardDescription>
    </CardHeader>
  );
}
