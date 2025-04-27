
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  MoreHorizontal, 
  AlertCircle, 
  Edit, 
  Eye, 
  Trash, 
  FilePlus,
  MessageSquare
} from 'lucide-react';
import { Client, statusLabels } from '@/types/client';

interface ClientsGridProps {
  clients: Client[];
  isLoading: boolean;
  error?: string;
}

export const ClientsGrid = ({ clients, isLoading, error }: ClientsGridProps) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardFooter>
          </Card>
        ))}
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
  
  if (clients.length === 0) {
    return (
      <div className="rounded-md border p-10 text-center">
        <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Nenhum cliente encontrado.</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Não há clientes correspondentes aos filtros aplicados.
        </p>
        <Button>Adicionar Cliente</Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {clients.map((client) => (
        <Card key={client.id} className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
          <div onClick={() => navigate(`/clients/${client.id}`)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {client.type === 'pessoa_fisica' ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building className="h-4 w-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-base">{client.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm mt-1">
                    {client.type === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}: {client.document}
                  </CardDescription>
                </div>
                <Badge className={statusLabels[client.status].color}>
                  {statusLabels[client.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pb-2">
              <div className="flex items-center text-sm">
                <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              {client.address && (
                <div className="flex items-start text-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Building className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  </div>
                  <span className="line-clamp-1">
                    {client.address}
                    {client.city && `, ${client.city}`}
                    {client.state && `/${client.state}`}
                  </span>
                </div>
              )}
            </CardContent>
          </div>
          <CardFooter className="pt-0 pb-3 flex justify-between items-center border-t mt-2 pt-3">
            <div className="flex flex-col">
              <div className="flex items-center text-sm">
                <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span className="font-medium">{client.activeCases}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  casos ativos
                </span>
              </div>
              <div className="text-sm font-medium">{formatCurrency(client.totalValue)}</div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
