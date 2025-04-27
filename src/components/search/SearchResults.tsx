
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, FileText, User } from 'lucide-react';
import { DocumentResults } from './results/DocumentResults';
import { CaseResults } from './results/CaseResults';
import { ClientResults } from './results/ClientResults';
import { EmptySearchState } from './EmptySearchState';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  searchTerm: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredDocuments: any[];
  filteredCases: any[];
  filteredClients: any[];
}

export function SearchResults({
  searchTerm,
  activeTab,
  setActiveTab,
  filteredDocuments,
  filteredCases,
  filteredClients
}: SearchResultsProps) {
  const totalResults = filteredDocuments.length + filteredCases.length + filteredClients.length;
  
  if (!searchTerm) {
    return (
      <EmptySearchState 
        icon={<SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />}
        title="Digite um termo para buscar"
        description="Você pode buscar por documentos, casos, clientes e mais."
      />
    );
  }
  
  if (totalResults === 0) {
    return (
      <EmptySearchState 
        icon={<SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />}
        title="Nenhum resultado encontrado"
        description="Tente buscar por outro termo ou refinar seus filtros."
      />
    );
  }
  
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">
          Todos ({totalResults})
        </TabsTrigger>
        <TabsTrigger value="documents">
          Documentos ({filteredDocuments.length})
        </TabsTrigger>
        <TabsTrigger value="cases">
          Casos ({filteredCases.length})
        </TabsTrigger>
        <TabsTrigger value="clients">
          Clientes ({filteredClients.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-6">
        {filteredDocuments.length > 0 && (
          <Card className="overflow-hidden">
            <DocumentResults 
              documents={filteredDocuments.slice(0, 2)}
              showCompact={true}
            />
            {filteredDocuments.length > 2 && (
              <div className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('documents')}
                >
                  Ver todos os documentos ({filteredDocuments.length})
                </Button>
              </div>
            )}
          </Card>
        )}
        
        {filteredCases.length > 0 && (
          <Card className="overflow-hidden">
            <CaseResults 
              cases={filteredCases.slice(0, 2)}
              showCompact={true}
            />
            {filteredCases.length > 2 && (
              <div className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('cases')}
                >
                  Ver todos os casos ({filteredCases.length})
                </Button>
              </div>
            )}
          </Card>
        )}
        
        {filteredClients.length > 0 && (
          <Card className="overflow-hidden">
            <ClientResults 
              clients={filteredClients.slice(0, 2)}
              showCompact={true}
            />
            {filteredClients.length > 2 && (
              <div className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('clients')}
                >
                  Ver todos os clientes ({filteredClients.length})
                </Button>
              </div>
            )}
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="documents">
        {filteredDocuments.length > 0 ? (
          <Card>
            <DocumentResults documents={filteredDocuments} showCompact={false} />
          </Card>
        ) : (
          <EmptySearchState 
            icon={<FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />}
            title="Nenhum documento encontrado"
            description="Tente buscar por outro termo ou refinar seus filtros."
          />
        )}
      </TabsContent>
      
      <TabsContent value="cases">
        {filteredCases.length > 0 ? (
          <Card>
            <CaseResults cases={filteredCases} showCompact={false} />
          </Card>
        ) : (
          <EmptySearchState 
            icon={<FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />}
            title="Nenhum caso encontrado"
            description="Tente buscar por outro termo ou refinar seus filtros."
          />
        )}
      </TabsContent>
      
      <TabsContent value="clients">
        {filteredClients.length > 0 ? (
          <Card>
            <ClientResults clients={filteredClients} showCompact={false} />
          </Card>
        ) : (
          <EmptySearchState 
            icon={<User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />}
            title="Nenhum cliente encontrado"
            description="Tente buscar por outro termo ou refinar seus filtros."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
