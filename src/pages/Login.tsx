import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from "lucide-react";
import { cadastrarUsuario, loginUsuario } from "../api/codechellaApi";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [signupData, setSignupData] = useState({ nome: "", email: "", senha: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const data = await loginUsuario(loginData.email, loginData.senha);
      
      // Grava o usuário no contexto e localStorage
      setUser(data);
      
      // Redireciona baseado no tipoUsuario vindo do backend (TipoUsuario: SUPER, ADMIN, USER)
      if (data.tipoUsuario === "SUPER") {
        navigate("/super-admin");
      } else if (data.tipoUsuario === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMsg(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    // Valida se a senha tem no mínimo 6 caracteres
    if (signupData.senha.length < 6) {
      setMsg("Senha deve ter no mínimo 6 caracteres!");
      setLoading(false);
      return;
    }

    if (signupData.senha !== signupData.confirmPassword) {
      setMsg("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const user = { 
      nome: signupData.nome, 
      email: signupData.email, 
      senha: signupData.senha,
      confirmarSenha: signupData.confirmPassword
    };

    try {
      await cadastrarUsuario(user);
      setMsg("Conta criada com sucesso! Faça login para continuar.");
      setSignupData({ nome: "", email: "", senha: "", confirmPassword: "" }); // limpa formulário
    } catch (err) {
      setMsg(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CodeChella
            </span>
          </div>
          <p className="text-muted-foreground">Sua plataforma de eventos e ingressos</p>
          {msg && <p className="mt-3 text-red-500">{msg}</p>}
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>Entre com sua conta para continuar</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Entrar"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/")}>
                    Voltar ao início
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Cadastre-se para começar a comprar ingressos</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome completo</Label>
                    <Input
                      type="text"
                      value={signupData.nome}
                      onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={signupData.senha}
                      onChange={(e) => setSignupData({ ...signupData, senha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar senha</Label>
                    <Input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Criar conta"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/")}>
                    Voltar ao início
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Login;
