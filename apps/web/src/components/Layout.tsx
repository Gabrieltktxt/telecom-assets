import { useState } from "react";
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

  // Estado para controlar o menu no celular
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* 🔝 Barra superior (só aparece no celular) */}
      <div className="md:hidden bg-slate-800 text-white flex items-center justify-between p-4">
        <h1 className="text-lg font-bold">📡 Telecom Assets</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl focus:outline-none"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 📂 Menu Lateral */}
      <aside
        className={`
        ${isOpen ? "block" : "hidden"} 
        md:flex md:flex-col w-full md:w-60 bg-slate-800 p-4
      `}
      >
        <h1 className="hidden md:block text-white text-lg font-bold mb-6">
          📡 Telecom Assets
        </h1>

        <nav className="space-y-1 flex-1">
          {/* Ao clicar em um link, fecha o menu no celular */}
          <div onClick={() => setIsOpen(false)}>
            <NavLink to="/" end className={link}>
              Dashboard
            </NavLink>
          </div>
          <div onClick={() => setIsOpen(false)}>
            <NavLink to="/ativos" className={link}>
              Ativos
            </NavLink>
          </div>
          <div onClick={() => setIsOpen(false)}>
            <NavLink to="/manutencoes" className={link}>
              Manutenções
            </NavLink>
          </div>
          <div onClick={() => setIsOpen(false)}>
            <NavLink to="/locais" className={link}>
              Locais
            </NavLink>
          </div>
          {isAdmin && (
            <div onClick={() => setIsOpen(false)}>
              <NavLink to="/usuarios" className={link}>
                Usuários
              </NavLink>
            </div>
          )}
        </nav>

        <div className="text-slate-400 text-xs pt-4 border-t border-slate-700 mt-4 md:mt-0">
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

      {/* 📄 Conteúdo Principal */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
