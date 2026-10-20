import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

export default function Locais() {
  const { user } = useAuth();
  const { canManageLocal } = usePermissions();
  const [lista, setLista] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  async function carregar() {
    const { data } = await api.get("/locais");
    setLista(data);
  }

  useEffect(() => {
    carregar();
    if (canManageLocal) api.get("/usuarios").then((r) => setUsuarios(r.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function salvar() {
    try {
      if (form.id) await api.patch(`/locais/${form.id}`, form);
      else await api.post("/locais", form);
      setForm(null);
      carregar();
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Locais</h1>
        {canManageLocal && (
          <button
            onClick={() =>
              setForm({ nome: "", endereco: "", responsavelId: "" })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Novo Local
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {lista.map((l) => (
          <div key={l.id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold">{l.nome}</h3>
            <p className="text-sm text-slate-500">{l.endereco}</p>
            <p className="text-xs text-slate-400 mt-2">
              👤 {l.responsavel?.nome || "Sem responsável"}
            </p>
            <p className="text-xs mt-2 font-semibold text-blue-600">
              {l._count.ativos} equipamentos
            </p>
            {canManageLocal && (
              <button
                onClick={() => setForm(l)}
                className="text-xs text-blue-600 mt-2"
              >
                Editar
              </button>
            )}
          </div>
        ))}
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
              {form.id ? "Editar" : "Novo"} Local
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
                placeholder="Endereço"
                value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              />
              <select
                className="border rounded p-2 w-full"
                value={form.responsavelId || ""}
                onChange={(e) =>
                  setForm({ ...form, responsavelId: e.target.value })
                }
              >
                <option value="">Sem responsável</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
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
