import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  nome: string;
  email: string;
  role: "ADMIN" | "TECNICO" | "CONSULTA";
};

type Ctx = {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx>({} as Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      api
        .get("/auth/me")
        .then((r) => setUser(r.data))
        .catch(() => {});
    }
  }, []);

  async function login(email: string, senha: string) {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("token", data.token);
    setUser(data.usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
