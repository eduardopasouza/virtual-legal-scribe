
import { useState, useEffect } from 'react';
import { Client, ClientStats } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';

// Dados simulados para desenvolvimento
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    status: 'active',
    type: 'pessoa_fisica',
    document: '123.456.789-00',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    cases: 2,
    activeCases: 2,
    totalValue: 15000,
    lastActivity: new Date('2024-04-15'),
    createdAt: new Date('2023-10-05'),
    responsibleLawyer: 'Dr. Carlos Mendes',
    notes: 'Cliente prioritário',
    tags: ['familiar', 'prioritário']
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    status: 'active',
    type: 'pessoa_fisica',
    document: '987.654.321-00',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01304-000',
    cases: 1,
    activeCases: 1,
    totalValue: 8000,
    lastActivity: new Date('2024-04-10'),
    createdAt: new Date('2023-11-15'),
    responsibleLawyer: 'Dra. Ana Soares',
    tags: ['trabalhista']
  },
  {
    id: '3',
    name: 'Empresa ABC Ltda.',
    email: 'contato@empresaabc.com',
    phone: '(11) 3456-7890',
    status: 'active',
    type: 'pessoa_juridica',
    document: '12.345.678/0001-90',
    address: 'Av. Brigadeiro Faria Lima, 3000',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04538-132',
    cases: 3,
    activeCases: 2,
    totalValue: 50000,
    lastActivity: new Date('2024-04-17'),
    createdAt: new Date('2023-08-20'),
    responsibleLawyer: 'Dr. Carlos Mendes',
    notes: 'Contrato anual renovável',
    tags: ['contrato', 'empresarial']
  },
  {
    id: '4',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    phone: '(11) 92345-6789',
    status: 'pending',
    type: 'pessoa_fisica',
    document: '111.222.333-44',
    address: 'Rua Oscar Freire, 123',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01426-000',
    cases: 1,
    activeCases: 1,
    totalValue: 3500,
    lastActivity: new Date('2024-04-18'),
    createdAt: new Date('2024-03-10'),
    responsibleLawyer: 'Dra. Ana Soares',
    tags: ['novo']
  },
  {
    id: '5',
    name: 'Lúcia Ferreira',
    email: 'lucia.ferreira@email.com',
    phone: '(11) 93456-7890',
    status: 'active',
    type: 'pessoa_fisica',
    document: '555.666.777-88',
    address: 'Rua Haddock Lobo, 595',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01414-001',
    cases: 3,
    activeCases: 3,
    totalValue: 22000,
    lastActivity: new Date('2024-04-16'),
    createdAt: new Date('2023-09-15'),
    tags: ['imobiliário']
  },
  {
    id: '6',
    name: 'Tech Solutions S.A.',
    email: 'contato@techsolutions.com',
    phone: '(11) 4567-8901',
    status: 'inactive',
    type: 'pessoa_juridica',
    document: '98.765.432/0001-10',
    address: 'Av. Eng. Luís Carlos Berrini, 1500',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04571-000',
    cases: 0,
    activeCases: 0,
    totalValue: 0,
    lastActivity: new Date('2024-02-25'),
    createdAt: new Date('2023-06-10'),
    responsibleLawyer: 'Dr. Carlos Mendes',
    notes: 'Contrato encerrado em fevereiro/2024',
    tags: ['empresarial', 'inativo']
  }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<ClientStats | undefined>(undefined);
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        // Em uma implementação real, aqui teríamos a chamada para o Supabase
        // const { data, error } = await supabase.from('clients').select('*');
        
        // Simulando um delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Usando dados simulados
        const data = mockClients;
        
        setClients(data);
        
        // Calculando estatísticas
        if (data) {
          const activeClients = data.filter(c => c.status === 'active').length;
          const inactiveClients = data.filter(c => c.status === 'inactive').length;
          const pendingClients = data.filter(c => c.status === 'pending').length;
          const totalActiveCases = data.reduce((sum, client) => sum + client.activeCases, 0);
          const totalCases = data.reduce((sum, client) => sum + client.cases, 0);
          const totalValue = data.reduce((sum, client) => sum + client.totalValue, 0);
          
          setStats({
            totalClients: data.length,
            activeClients,
            inactiveClients,
            pendingClients,
            totalCases,
            totalActiveCases,
            totalValue
          });
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Ocorreu um erro ao carregar os dados dos clientes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    stats,
  };
};
