import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@telecom.com");
  const [senha, setSenha] = useState("admin123");
  const [erro, setErro] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, senha);
      nav("/");
    } catch {
      setErro("Credenciais inválidas");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl w-full max-w-sm mx-4 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-1">📡 Telecom Assets</h1>
        <p className="text-slate-500 text-sm mb-6">Faça login para continuar</p>

        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        <label className="block text-sm mb-1">E-mail</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm mb-1">Senha</label>
        <input
          type="password"
          className="w-full border rounded p-2 mb-4"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Entrar
        </button>

        <div className="text-center text-sm text-slate-500 mt-6 pt-4 border-t">
          Não tem conta?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Criar agora
          </Link>
        </div>
      </form>
    </div>
  );
}
