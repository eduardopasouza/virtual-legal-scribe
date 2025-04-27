
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const documentTypes = [
  { value: 'petition', label: 'Petição' },
  { value: 'contract', label: 'Contrato' },
  { value: 'evidence', label: 'Evidência' },
  { value: 'proceeding', label: 'Processo' },
  { value: 'legal-research', label: 'Pesquisa Jurídica' }
];

export function DocumentTypeSelect({ value, onChange, disabled = false }: DocumentTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="document-type">
        Tipo de documento
      </label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="document-type" className="w-full">
          <SelectValue placeholder="Selecione o tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          {documentTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
