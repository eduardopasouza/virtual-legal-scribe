
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  cases: number;
  lastActivity: Date;
}

export const statusLabels = {
  active: { label: 'Ativo', color: 'bg-green-500' },
  inactive: { label: 'Inativo', color: 'bg-gray-400' },
  pending: { label: 'Pendente', color: 'bg-amber-500' }
} as const;

