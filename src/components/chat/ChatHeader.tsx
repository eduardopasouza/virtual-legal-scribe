
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agents } from '@/constants/agents';
import { AgentType } from '@/hooks/agent/types';
import { WorkflowStage } from '@/workflow/types';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  activeAgent: AgentType;
  onAgentChange?: (agent: AgentType) => void;
  currentStage?: WorkflowStage;
  clientInfo?: any;
  showAgentSelector?: boolean;
}

export function ChatHeader({ 
  activeAgent, 
  onAgentChange,
  currentStage,
  clientInfo,
  showAgentSelector = true
}: ChatHeaderProps) {
  // Find the active agent details
  const agent = agents.find(a => a.type === activeAgent) || agents[0];
  
  // Default avatar and role if they don't exist in the agent object
  const avatarUrl = agent.avatar || '/placeholder.svg';
  const agentRole = agent.role || agent.description || 'Assistente';
  
  return (
    <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl} alt={agent.name} />
          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agentRole}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {currentStage && (
          <Badge variant="outline" className="font-normal bg-muted/50 text-xs">
            {currentStage.status === 'completed' ? 'Concluído' : 
             currentStage.status === 'in_progress' ? 'Em andamento' : 
             'Pendente'}: {currentStage.stage_name}
          </Badge>
        )}
        
        {showAgentSelector && onAgentChange && (
          <Select value={activeAgent} onValueChange={(value) => onAgentChange(value as AgentType)}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Mudar especialista" />
            </SelectTrigger>
            <SelectContent>
              {agents.map(a => (
                <SelectItem key={a.type} value={a.type}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={a.avatar || '/placeholder.svg'} alt={a.name} />
                      <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{a.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </CardHeader>
  );
}
