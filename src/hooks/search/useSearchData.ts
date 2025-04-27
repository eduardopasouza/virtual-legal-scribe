import { useState } from 'react';

export function useSearchData() {
  const [documents] = useState([
    { 
      id: '1', 
      title: 'Petição Inicial - Danos Morais', 
      type: 'Petição',
      date: new Date('2024-04-10'),
      case: 'Processo nº 0123456-78.2024.8.26.0100',
      tags: ['danos morais', 'petição inicial'],
      excerpt: 'A presente ação tem como objetivo buscar indenização por danos morais em razão da publicação indevida de dados pessoais...'
    },
    { 
      id: '2', 
      title: 'Contestação - Processo Tributário', 
      type: 'Contestação',
      date: new Date('2024-03-15'),
      case: 'Processo nº 0987654-32.2024.8.26.0100',
      tags: ['tributário', 'contestação'],
      excerpt: 'Em resposta à petição inicial apresentada pelo autor, vimos apresentar contestação com base nos seguintes argumentos de fato e de direito...'
    },
    { 
      id: '3', 
      title: 'Contrato de Prestação de Serviços', 
      type: 'Contrato',
      date: new Date('2024-02-20'),
      case: 'N/A',
      tags: ['contrato', 'serviços'],
      excerpt: 'Contrato de prestação de serviços advocatícios firmado entre as partes com o objetivo de representação em processos trabalhistas...'
    },
    { 
      id: '4', 
      title: 'Recurso de Apelação - João Santos', 
      type: 'Recurso',
      date: new Date('2024-04-05'),
      case: 'Processo nº 1234567-89.2023.8.26.0100',
      tags: ['apelação', 'recurso'],
      excerpt: 'Não se conformando com a r. sentença de fls., vem o réu, tempestivamente, interpor o presente RECURSO DE APELAÇÃO...'
    }
  ]);
  
  const [cases] = useState([
    {
      id: '1',
      title: 'Ação de Indenização por Danos Morais',
      client: 'Maria Silva',
      status: 'Em andamento',
      date: new Date('2024-04-10'),
      lastUpdate: new Date('2024-04-15'),
      tags: ['cível', 'danos morais']
    },
    {
      id: '2',
      title: 'Processo Tributário - Impugnação de Débito',
      client: 'Empresa ABC Ltda',
      status: 'Em andamento',
      date: new Date('2024-03-20'),
      lastUpdate: new Date('2024-04-12'),
      tags: ['tributário', 'impugnação']
    },
    {
      id: '3',
      title: 'Reclamação Trabalhista',
      client: 'João Santos',
      status: 'Concluído',
      date: new Date('2023-11-10'),
      lastUpdate: new Date('2024-02-25'),
      tags: ['trabalhista', 'reclamação']
    }
  ]);
  
  const [clients] = useState([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      phone: '(11) 98765-4321',
      cases: 2,
      lastActivity: new Date('2024-04-15')
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      phone: '(11) 91234-5678',
      cases: 1,
      lastActivity: new Date('2024-04-10')
    },
    {
      id: '3',
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '(11) 3456-7890',
      cases: 1,
      lastActivity: new Date('2024-04-12')
    }
  ]);

  return {
    documents,
    cases,
    clients
  };
}
