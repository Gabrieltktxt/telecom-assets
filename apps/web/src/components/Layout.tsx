import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

const link = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-lg text-sm ${
    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const { isAdmin, isConsulta } = usePermissions();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-800 p-4 flex flex-col">
        <h1 className="text-white text-lg font-bold mb-6">📡 Telecom Assets</h1>

        <nav className="space-y-1 flex-1">
          <NavLink to="/" end className={link}>
            Dashboard
          </NavLink>
          <NavLink to="/ativos" className={link}>
            Ativos
          </NavLink>
          <NavLink to="/manutencoes" className={link}>
            Manutenções
          </NavLink>
          <NavLink to="/locais" className={link}>
            Locais
          </NavLink>
          {isAdmin && (
            <NavLink to="/usuarios" className={link}>
              Usuários
            </NavLink>
          )}
        </nav>

        <div className="text-slate-400 text-xs pt-4 border-t border-slate-700">
          <div className="mb-2">
            {user?.nome}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                isAdmin
                  ? "bg-red-500 text-white"
                  : isConsulta
                    ? "bg-slate-500 text-white"
                    : "bg-blue-500 text-white"
              }`}
            >
              {user?.role}
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
