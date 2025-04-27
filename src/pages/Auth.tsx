
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  // Se o usuário já estiver autenticado, redireciona para a página inicial
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (action: "login" | "signup") => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (action === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        toast({
          title: "Conta criada com sucesso",
          description: "Por favor, verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-evji-primary">
          Sistema Jurídico
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Gerencie seus casos com eficiência
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Autenticação</CardTitle>
          <CardDescription>
            Faça login ou crie uma nova conta para continuar
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mt-4 mx-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="login">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubmit("login")}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubmit("signup")}
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Conta"}
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Para desenvolvimento, você pode {" "}
        <a 
          href="https://supabase.com/dashboard/project/fqgrnfcaxivngjqjruvy/auth/users" 
          target="_blank" 
          className="underline"
        >
          desabilitar a verificação por email
        </a> {" "}
        nas configurações do Supabase.
      </p>
    </div>
  );
}
