
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AgentType } from '@/hooks/agent/types';
import { agents } from '@/constants/agents';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  activeAgent?: AgentType;
  onAgentChange?: (agent: AgentType) => void;
  currentStage?: string;
  clientInfo?: any;
}

export function ChatHeader({ 
  activeAgent = 'analista-requisitos', 
  onAgentChange,
  currentStage,
  clientInfo
}: ChatHeaderProps) {
  const selectedAgent = agents.find(agent => agent.type === activeAgent);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleAgentChange = (agentType: AgentType) => {
    if (onAgentChange) {
      onAgentChange(agentType);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={`/agents/${activeAgent}.png`} alt={selectedAgent?.name} />
          <AvatarFallback>{selectedAgent?.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-medium">{selectedAgent?.name}</h3>
          {currentStage && (
            <Badge variant="outline" className="text-xs py-0">
              {currentStage}
            </Badge>
          )}
        </div>
      </div>
      
      {clientInfo && (
        <div className="flex items-center">
          <Badge variant="secondary" className="ml-2">
            Cliente: {clientInfo.name}
          </Badge>
        </div>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8">
            Agentes <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Selecione um Agente</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {agents.map((agent) => (
            <DropdownMenuItem 
              key={agent.type}
              onClick={() => handleAgentChange(agent.type as AgentType)}
              className={activeAgent === agent.type ? "bg-secondary" : ""}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`/agents/${agent.type}.png`} alt={agent.name} />
                  <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="hidden md:flex space-x-1">
        <TooltipProvider>
          {agents.slice(0, 5).map((agent) => (
            <Tooltip key={agent.type}>
              <TooltipTrigger asChild>
                <Button
                  key={agent.type}
                  variant={agent.type === activeAgent ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleAgentChange(agent.type as AgentType)}
                >
                  {getInitials(agent.name)}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
