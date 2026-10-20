import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

const STATUS = [
  "ABERTA",
  "EM_ANDAMENTO",
  "AGUARDANDO_PECA",
  "CONCLUIDA",
  "CANCELADA",
];

export default function Manutencoes() {
  const { user } = useAuth();
  const { canOpenManutencao, canUpdateManutencao, canDeleteManutencao } =
    usePermissions();
  const [lista, setLista] = useState<any[]>([]);
  const [ativos, setAtivos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);
  const podeCriar = canOpenManutencao;

  async function carregar() {
    const { data } = await api.get("/manutencoes");
    setLista(data);
  }

  useEffect(() => {
    carregar();
    api.get("/ativos").then((r) => setAtivos(r.data));
    if (canOpenManutencao) {
      // Admin e técnico buscam usuários, mas só admin consegue (retorna 403 para técnico)
      // Vamos buscar o "me" para saber o usuário atual
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nova() {
    setForm({
      ativoId: ativos[0]?.id,
      problema: "",
      servico: "",
      pecas: "",
      tecnicoId: user?.id, // usa o próprio usuário logado como técnico
    });
  }

  async function salvar() {
    try {
      await api.post("/manutencoes", form);
      setForm(null);
      carregar();
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro");
    }
  }

  async function atualizar(id: string, status: string) {
    await api.patch(`/manutencoes/${id}`, { status });
    carregar();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta manutenção? Esta ação não pode ser desfeita."))
      return;
    try {
      await api.delete(`/manutencoes/${id}`);
      carregar();
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Manutenções</h1>
        {podeCriar && (
          <button
            onClick={nova}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Abrir Manutenção
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATUS.map((st) => (
          <div key={st} className="bg-slate-50 rounded-xl p-3 min-h-[300px]">
            <h3 className="font-semibold text-xs mb-3 text-slate-600 uppercase">
              {st.replace("_", " ")}
            </h3>
            <div className="space-y-2">
              {lista
                .filter((m) => m.status === st)
                .map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-3 rounded-lg shadow text-xs space-y-1"
                  >
                    <div className="font-semibold">{m.ativo.modelo}</div>
                    <div className="text-slate-500">{m.ativo.numeroSerie}</div>
                    <div className="text-slate-600">{m.problema}</div>
                    <div className="text-slate-400">👤 {m.tecnico.nome}</div>

                    {canUpdateManutencao &&
                      st !== "CONCLUIDA" &&
                      st !== "CANCELADA" && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {st !== "EM_ANDAMENTO" && (
                            <button
                              onClick={() => atualizar(m.id, "EM_ANDAMENTO")}
                              className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]"
                            >
                              Em andamento
                            </button>
                          )}
                          {st !== "AGUARDANDO_PECA" && (
                            <button
                              onClick={() => atualizar(m.id, "AGUARDANDO_PECA")}
                              className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px]"
                            >
                              Aguard. peça
                            </button>
                          )}
                          <button
                            onClick={() => atualizar(m.id, "CONCLUIDA")}
                            className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px]"
                          >
                            Concluir
                          </button>
                          <button
                            onClick={() => atualizar(m.id, "CANCELADA")}
                            className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                    {canDeleteManutencao && (
                      <button
                        onClick={() => excluir(m.id)}
                        className="text-red-600 hover:text-red-700 text-[10px] pt-1"
                      >
                        🗑️ Excluir
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
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
            <h2 className="text-lg font-bold mb-4">Nova Manutenção</h2>
            <div className="space-y-3 text-sm">
              <select
                className="border rounded p-2 w-full"
                value={form.ativoId}
                onChange={(e) => setForm({ ...form, ativoId: e.target.value })}
              >
                {ativos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.numeroSerie} - {a.modelo}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-500">
                Técnico responsável: <strong>{user?.nome}</strong>
              </div>
              <textarea
                className="border rounded p-2 w-full"
                placeholder="Problema identificado"
                value={form.problema}
                onChange={(e) => setForm({ ...form, problema: e.target.value })}
              />
              <textarea
                className="border rounded p-2 w-full"
                placeholder="Serviço realizado"
                value={form.servico}
                onChange={(e) => setForm({ ...form, servico: e.target.value })}
              />
              <textarea
                className="border rounded p-2 w-full"
                placeholder="Peças utilizadas"
                value={form.pecas}
                onChange={(e) => setForm({ ...form, pecas: e.target.value })}
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
