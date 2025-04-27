
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Bell, Shield, UserCog, Laptop, LogOut, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Preferências de notificações atualizadas",
      description: "Suas preferências de notificações foram atualizadas com sucesso."
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso."
    });
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-evji-primary">Configurações</h1>
            </div>
            
            <Tabs defaultValue="profile">
              <div className="flex">
                <div className="flex flex-col w-full md:w-[200px] md:shrink-0 md:border-r md:pr-4 md:mr-4">
                  <TabsList className="flex md:flex-col h-auto justify-start gap-2 mb-4 bg-transparent p-0">
                    <TabsTrigger value="profile" className="justify-start w-full data-[state=active]:bg-muted">
                      <UserCog className="h-4 w-4 mr-2" />
                      Perfil
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start w-full data-[state=active]:bg-muted">
                      <Bell className="h-4 w-4 mr-2" />
                      Notificações
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start w-full data-[state=active]:bg-muted">
                      <Shield className="h-4 w-4 mr-2" />
                      Segurança
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start w-full data-[state=active]:bg-muted">
                      <Laptop className="h-4 w-4 mr-2" />
                      Aparência
                    </TabsTrigger>
                  </TabsList>
                  
                  <Separator className="md:hidden my-4" />
                  
                  <div className="mt-auto hidden md:block">
                    <Button variant="outline" className="w-full justify-start text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <TabsContent value="profile" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações do Perfil</CardTitle>
                        <CardDescription>
                          Atualize suas informações pessoais.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Usuário" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <h3 className="font-medium">Foto de perfil</h3>
                            <p className="text-sm text-muted-foreground">
                              Esta foto será utilizada em todas as interfaces do sistema.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">Alterar</Button>
                              <Button variant="ghost" size="sm">Remover</Button>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome completo</Label>
                            <Input id="name" defaultValue="Paulo Oliveira" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="paulo@evji.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="oab">Número OAB</Label>
                            <Input id="oab" defaultValue="123456/SP" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" defaultValue="(11) 98765-4321" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleSaveProfile}>Salvar</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferências de Notificação</CardTitle>
                        <CardDescription>
                          Configure como e quando você recebe notificações.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Notificações no Sistema</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="new-case">Novos casos</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba notificações quando novos casos forem atribuídos a você.
                                </p>
                              </div>
                              <Switch id="new-case" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="deadline">Prazos próximos</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba alertas sobre prazos se aproximando.
                                </p>
                              </div>
                              <Switch id="deadline" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="document-analysis">Análises concluídas</Label>
                                <p className="text-sm text-muted-foreground">
                                  Seja notificado quando análises de documentos forem concluídas.
                                </p>
                              </div>
                              <Switch id="document-analysis" defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Notificações por Email</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="email-summary">Resumo diário</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba um resumo diário das atividades por email.
                                </p>
                              </div>
                              <Switch id="email-summary" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="email-deadline">Alertas de prazo críticos</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba emails para prazos críticos.
                                </p>
                              </div>
                              <Switch id="email-deadline" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="email-marketing">Comunicados e novidades</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba atualizações sobre novas funcionalidades do EVJI.
                                </p>
                              </div>
                              <Switch id="email-marketing" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Segurança</CardTitle>
                        <CardDescription>
                          Gerencie sua senha e as configurações de segurança.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Alterar Senha</h3>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="current-password">Senha atual</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="new-password">Nova senha</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Segurança da Conta</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="two-factor">Autenticação de dois fatores</Label>
                                <p className="text-sm text-muted-foreground">
                                  Adicione uma camada extra de segurança à sua conta.
                                </p>
                              </div>
                              <Switch id="two-factor" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="session-expiry">Expirar sessão após inatividade</Label>
                                <p className="text-sm text-muted-foreground">
                                  Encerra automaticamente sua sessão após período inativo.
                                </p>
                              </div>
                              <Switch id="session-expiry" defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Sessões Ativas</h3>
                          <div className="space-y-2">
                            <div className="rounded-md border p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Chrome em Windows</p>
                                  <p className="text-sm text-muted-foreground">São Paulo, Brasil • Agora mesmo</p>
                                </div>
                                <Button variant="ghost" className="h-8">Este dispositivo</Button>
                              </div>
                            </div>
                            <div className="rounded-md border p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Safari em MacOS</p>
                                  <p className="text-sm text-muted-foreground">São Paulo, Brasil • 2 dias atrás</p>
                                </div>
                                <Button variant="ghost" className="h-8 text-destructive hover:text-destructive">Encerrar</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleSavePassword}>Atualizar Senha</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Aparência</CardTitle>
                        <CardDescription>
                          Personalize a aparência da interface do EVJI.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Tema</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-md border cursor-pointer bg-background ring-2 ring-primary">
                              <p className="font-medium">Claro</p>
                              <p className="text-xs text-muted-foreground">Padrão do sistema</p>
                            </div>
                            <div className="p-4 rounded-md border cursor-pointer bg-slate-900 text-white">
                              <p className="font-medium">Escuro</p>
                              <p className="text-xs opacity-70">Alto contraste</p>
                            </div>
                            <div className="p-4 rounded-md border cursor-pointer">
                              <p className="font-medium">Sistema</p>
                              <p className="text-xs text-muted-foreground">Baseado no seu sistema</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Densidade</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-md border cursor-pointer">
                              <p className="font-medium">Compacta</p>
                              <p className="text-xs text-muted-foreground">Mais informação visível</p>
                            </div>
                            <div className="p-4 rounded-md border cursor-pointer ring-2 ring-primary">
                              <p className="font-medium">Normal</p>
                              <p className="text-xs text-muted-foreground">Densidade padrão</p>
                            </div>
                            <div className="p-4 rounded-md border cursor-pointer">
                              <p className="font-medium">Confortável</p>
                              <p className="text-xs text-muted-foreground">Espaçamento maior</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Outras Preferências</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="animations">Animações</Label>
                              <p className="text-sm text-muted-foreground">
                                Ativar animações na interface.
                              </p>
                            </div>
                            <Switch id="animations" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="sidebar">Barra lateral expandida</Label>
                              <p className="text-sm text-muted-foreground">
                                Manter a barra lateral expandida por padrão.
                              </p>
                            </div>
                            <Switch id="sidebar" defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={() => {
                          toast({
                            title: "Aparência atualizada",
                            description: "As configurações de aparência foram salvas."
                          });
                        }}>Salvar Preferências</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
