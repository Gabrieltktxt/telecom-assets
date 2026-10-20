import { useEffect, useState } from "react";
import { api } from "../services/api";

const ROLES = ["ADMIN", "TECNICO", "CONSULTA"];

export default function Usuarios() {
  const [lista, setLista] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  async function carregar() {
    const { data } = await api.get("/usuarios");
    setLista(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    try {
      if (form.id) await api.patch(`/usuarios/${form.id}`, form);
      else await api.post("/usuarios", form);
      setForm(null);
      carregar();
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
        <button
          onClick={() =>
            setForm({ nome: "", email: "", senha: "", role: "CONSULTA" })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">E-mail</th>
              <th className="text-left p-3">Perfil</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3">{u.nome}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="p-3">{u.ativo ? "✅" : "⛔"}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setForm(u)}
                    className="text-blue-600 text-xs"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setForm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {form.id ? "Editar" : "Novo"} Usuário
            </h2>

            <div className="space-y-3 text-sm">
              <input
                className="border rounded p-2 w-full"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <input
                className="border rounded p-2 w-full"
                placeholder="E-mail"
                value={form.email}
                disabled={!!form.id}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {!form.id && (
                <input
                  type="password"
                  className="border rounded p-2 w-full"
                  placeholder="Senha"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              )}
              <select
                className="border rounded p-2 w-full"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setForm(null)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
