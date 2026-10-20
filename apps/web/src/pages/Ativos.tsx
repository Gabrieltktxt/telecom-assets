import { useEffect, useState } from "react";
import { api } from "../services/api";
import { usePermissions } from "../hooks/usePermissions";

const TIPOS = ["RADIO", "ANTENA", "REPETIDORA", "CABO", "SWITCH", "OUTRO"];
const STATUS = ["ATIVO", "INATIVO", "MANUTENCAO", "DESCARTADO", "RESERVADO"];

export default function Ativos() {
  const { canCreateAtivo, canEditAtivo, canDeleteAtivo } = usePermissions();
  const [lista, setLista] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [filtro, setFiltro] = useState({
    tipo: "",
    status: "",
    localId: "",
    q: "",
  });
  const [form, setForm] = useState<any>(null);

  async function carregar() {
    const params = Object.fromEntries(
      Object.entries(filtro).filter(([, v]) => v),
    );
    const { data } = await api.get("/ativos", { params });
    setLista(data);
  }

  useEffect(() => {
    api.get("/locais").then((r) => setLocais(r.data));
  }, []);

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  function novo() {
    setForm({
      tipo: "RADIO",
      fabricante: "",
      modelo: "",
      numeroSerie: "",
      patrimonio: "",
      localId: locais[0]?.id,
      status: "ATIVO",
      dataAquisicao: "",
      observacoes: "",
    });
  }

  async function salvar() {
    try {
      if (form.id) await api.patch(`/ativos/${form.id}`, form);
      else await api.post("/ativos", form);
      setForm(null);
      carregar();
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro ao salvar");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este ativo?")) return;
    await api.delete(`/ativos/${id}`);
    carregar();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Ativos</h1>
        {canCreateAtivo && (
          <button
            onClick={novo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Novo Ativo
          </button>
        )}
      </div>

      <div className="bg-white p-3 rounded-xl shadow flex flex-wrap gap-2">
        <select
          className="border rounded p-2"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        >
          <option value="">Todos os tipos</option>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={filtro.status}
          onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
        >
          <option value="">Todos os status</option>
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={filtro.localId}
          onChange={(e) => setFiltro({ ...filtro, localId: e.target.value })}
        >
          <option value="">Todos os locais</option>
          {locais.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome}
            </option>
          ))}
        </select>
        <input
          placeholder="Buscar série/modelo/patrimônio"
          className="border rounded p-2 flex-1 min-w-[200px]"
          value={filtro.q}
          onChange={(e) => setFiltro({ ...filtro, q: e.target.value })}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Fabricante/Modelo</th>
              <th className="text-left p-3">Série</th>
              <th className="text-left p-3">Patrimônio</th>
              <th className="text-left p-3">Local</th>
              <th className="text-left p-3">Status</th>
              {(canEditAtivo || canDeleteAtivo) && (
                <th className="text-right p-3">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr
                key={a.id}
                className="border-b last:border-0 hover:bg-slate-50"
              >
                <td className="p-3">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                    {a.tipo}
                  </span>
                </td>
                <td className="p-3">
                  {a.fabricante}{" "}
                  <span className="text-slate-400">{a.modelo}</span>
                </td>
                <td className="p-3 font-mono text-xs">{a.numeroSerie}</td>
                <td className="p-3 font-mono text-xs">{a.patrimonio || "—"}</td>
                <td className="p-3">{a.local?.nome}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      a.status === "ATIVO"
                        ? "bg-green-100 text-green-700"
                        : a.status === "MANUTENCAO"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                {(canEditAtivo || canDeleteAtivo) && (
                  <td className="p-3 text-right space-x-2">
                    {canEditAtivo && (
                      <button
                        className="text-blue-600"
                        onClick={() => setForm(a)}
                      >
                        Editar
                      </button>
                    )}
                    {canDeleteAtivo && (
                      <button
                        className="text-red-600"
                        onClick={() => excluir(a.id)}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Sem ativos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {form && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setForm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {form.id ? "Editar" : "Novo"} Ativo
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <select
                className="border rounded p-2 col-span-2"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                className="border rounded p-2"
                placeholder="Fabricante"
                value={form.fabricante}
                onChange={(e) =>
                  setForm({ ...form, fabricante: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Modelo"
                value={form.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
              />
              <input
                className="border rounded p-2"
                placeholder="Nº série"
                value={form.numeroSerie}
                onChange={(e) =>
                  setForm({ ...form, numeroSerie: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Patrimônio"
                value={form.patrimonio || ""}
                onChange={(e) =>
                  setForm({ ...form, patrimonio: e.target.value })
                }
              />
              <select
                className="border rounded p-2"
                value={form.localId}
                onChange={(e) => setForm({ ...form, localId: e.target.value })}
              >
                {locais.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nome}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                type="date"
                className="border rounded p-2 col-span-2"
                value={form.dataAquisicao?.slice(0, 10) || ""}
                onChange={(e) =>
                  setForm({ ...form, dataAquisicao: e.target.value })
                }
              />
              <textarea
                className="border rounded p-2 col-span-2"
                placeholder="Observações"
                value={form.observacoes || ""}
                onChange={(e) =>
                  setForm({ ...form, observacoes: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setForm(null)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="px-4 py-2 rounded bg-blue-600 text-white"
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
