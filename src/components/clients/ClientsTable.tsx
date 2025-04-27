
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  User, 
  Building,
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  AlertCircle,
  Edit,
  Trash,
  Eye,
  MessageSquare,
  FilePlus
} from 'lucide-react';
import { Client, statusLabels } from '@/types/client';
import { useNavigate } from 'react-router-dom';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  error?: string;
}

export const ClientsTable = ({ clients, isLoading, error }: ClientsTableProps) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Casos</TableHead>
              <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-10" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">Erro ao carregar os dados</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button>Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Casos</TableHead>
            <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
            <TableHead className="hidden md:table-cell">Última Atividade</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/clients/${client.id}`)}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {client.type === 'pessoa_fisica' ? (
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    {client.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                <TableCell>
                  <Badge className={statusLabels[client.status].color}>
                    {statusLabels[client.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{client.activeCases}</span>
                    {client.cases > client.activeCases && (
                      <span className="text-xs text-muted-foreground ml-1">/ {client.cases}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatCurrency(client.totalValue)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(client.lastActivity)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Cliente
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/cases/new?client=${client.id}`)}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Novo Caso
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="mr-2 h-4 w-4" />
                        Ligar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Reunião
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir Cliente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="font-medium text-lg mb-1">Nenhum cliente encontrado.</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Não há clientes correspondentes aos filtros aplicados.
                  </p>
                  <Button>Adicionar Cliente</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
