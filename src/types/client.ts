
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'pessoa_fisica' | 'pessoa_juridica';
  document: string; // CPF ou CNPJ
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  cases: number;
  activeCases: number;
  totalValue: number;
  lastActivity: Date;
  createdAt: Date;
  responsibleLawyer?: string;
  notes?: string;
  tags?: string[];
}

export const statusLabels = {
  active: { label: 'Ativo', color: 'bg-green-500' },
  inactive: { label: 'Inativo', color: 'bg-gray-400' },
  pending: { label: 'Pendente', color: 'bg-amber-500' }
} as const;

export const clientTypeLabels = {
  pessoa_fisica: { label: 'Pessoa Física', icon: 'user' },
  pessoa_juridica: { label: 'Pessoa Jurídica', icon: 'building' }
} as const;

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  totalCases: number;
  totalActiveCases: number;
  totalValue: number;
}

export interface ClientFilter {
  search: string;
  status: string | null;
  type: string | null;
  tags: string[];
  responsibleLawyer: string | null;
}
