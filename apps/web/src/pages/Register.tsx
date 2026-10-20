import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true);
    try {
      const { data } = await api.post("/auth/register", { nome, email, senha });
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErro(
        Array.isArray(msg) ? msg.join(", ") : msg || "Erro ao criar conta",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-8">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl w-96 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-1">📡 Telecom Assets</h1>
        <p className="text-slate-500 text-sm mb-6">Crie sua conta</p>

        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        <label className="block text-sm mb-1">Nome</label>
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label className="block text-sm mb-1">E-mail</label>
        <input
          type="email"
          className="w-full border rounded p-2 mb-3"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm mb-1">Senha</label>
        <input
          type="password"
          className="w-full border rounded p-2 mb-3"
          placeholder="Mínimo 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label className="block text-sm mb-1">Confirmar senha</label>
        <input
          type="password"
          className="w-full border rounded p-2 mb-4"
          placeholder="Repita a senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-2 rounded"
        >
          {carregando ? "Criando..." : "Criar conta"}
        </button>

        <div className="text-center text-sm text-slate-500 mt-6 pt-4 border-t">
          Já tem conta?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Fazer login
          </Link>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed">
          Ao criar conta, você terá acesso de <strong>consulta</strong>.<br />
          Para editar ou administrar, solicite a um administrador.
        </p>
      </form>
    </div>
  );
}
