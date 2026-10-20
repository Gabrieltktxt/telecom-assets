import { useAuth } from "../contexts/AuthContext";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isAdmin: role === "ADMIN",
    isTecnico: role === "TECNICO",
    isConsulta: role === "CONSULTA",

    // Ativos
    canCreateAtivo: role === "ADMIN" || role === "TECNICO",
    canEditAtivo: role === "ADMIN" || role === "TECNICO",
    canDeleteAtivo: role === "ADMIN",

    // Locais
    canManageLocal: role === "ADMIN",

    // Manutenções
    canOpenManutencao: role === "ADMIN" || role === "TECNICO",
    canUpdateManutencao: role === "ADMIN" || role === "TECNICO",
    canDeleteManutencao: role === "ADMIN",

    // Usuários
    canManageUsuarios: role === "ADMIN",
  };
}
