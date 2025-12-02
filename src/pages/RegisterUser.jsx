import { useState } from "react";
import { cadastrarUsuario } from "../api/codechellaApi";

export default function RegisterUser() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // Valida se a senha tem no mínimo 6 caracteres
    if (form.senha.length < 6) {
      setMsg("Senha deve ter no mínimo 6 caracteres!");
      setLoading(false);
      return;
    }

    // Valida se as senhas coincidem
    if (form.senha !== form.confirmarSenha) {
      setMsg("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      // Chamada para o backend
      const usuarioCadastrado = await cadastrarUsuario(form);

      setMsg(`Usuário ${usuarioCadastrado.nome} cadastrado com sucesso!`);
      
      // Limpa o formulário após sucesso
      setForm({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: ""
      });
    } catch (err) {
      // Mostra a mensagem de erro retornada pelo backend ou fallback
      setMsg(err.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar Senha"
          value={form.confirmarSenha}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Registrar"}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
