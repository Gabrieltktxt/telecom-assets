import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function Dashboard() {
  const [resumo, setResumo] = useState<any>({});
  const [porLocal, setPorLocal] = useState<any[]>([]);
  const [porTipo, setPorTipo] = useState<any[]>([]);
  const [mes, setMes] = useState<any[]>([]);
  const [problemas, setProblemas] = useState<any[]>([]);

  useEffect(() => {
    api.get("/dashboard/resumo").then((r) => setResumo(r.data));
    api.get("/dashboard/por-local").then((r) => setPorLocal(r.data));
    api.get("/dashboard/por-tipo").then((r) => setPorTipo(r.data));
    api.get("/dashboard/manutencoes-mes").then((r) => setMes(r.data));
    api.get("/dashboard/ativos-com-problema").then((r) => setProblemas(r.data));
  }, []);

  const card = (label: string, value: any, color: string, hint?: string) => (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-xs text-slate-500 uppercase">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value ?? "—"}</div>
      {hint && <div className="text-[10px] text-slate-400 mt-1">{hint}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {card("Total Equipamentos", resumo.totalEquipamentos, "text-slate-800")}
        {card("Ativos", resumo.ativos, "text-green-600")}
        {card("Inativos", resumo.inativos, "text-slate-500")}
        {card(
          "Em Manutenção",
          resumo.emManutencao,
          "text-amber-600",
          `${resumo.chamadosAbertos ?? 0} chamado(s) aberto(s)`,
        )}
        {card("Manut. no Mês", resumo.manutencoesNoMes, "text-blue-600")}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Distribuição por Local</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porLocal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="local" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Quantidade por Tipo</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porTipo}
                dataKey="total"
                nameKey="tipo"
                outerRadius={90}
                label
              >
                {porTipo.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Manutenções no Ano</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b font-semibold">Ativos com problema</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Ativo</th>
              <th className="text-left p-3">Local</th>
              <th className="text-left p-3">Problema</th>
              <th className="text-left p-3">Técnico</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {problemas.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3">
                  {p.ativo.modelo}{" "}
                  <span className="text-slate-400">
                    ({p.ativo.numeroSerie})
                  </span>
                </td>
                <td className="p-3">{p.ativo.local.nome}</td>
                <td className="p-3">{p.problema}</td>
                <td className="p-3">{p.tecnico.nome}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {problemas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  Nenhuma manutenção pendente 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
