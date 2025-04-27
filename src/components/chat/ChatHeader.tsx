
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AgentType } from '@/hooks/useAgentSimulation';
import { agents } from '@/constants/agents';

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
      
      <div className="flex space-x-1">
        {agents.map((agent) => (
          <Button
            key={agent.type}
            variant={agent.type === activeAgent ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            title={agent.description}
            onClick={() => handleAgentChange(agent.type as AgentType)}
          >
            {getInitials(agent.name)}
          </Button>
        ))}
      </div>
    </div>
  );
}
