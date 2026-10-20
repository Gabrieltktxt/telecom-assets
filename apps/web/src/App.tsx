import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Ativos from "./pages/Ativos";
import Manutencoes from "./pages/Manutencoes";
import Locais from "./pages/Locais";
import Usuarios from "./pages/Usuarios";

function Private({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!localStorage.getItem("token")) return <Navigate to="/login" />;
  if (!user) return <div className="p-8">Carregando...</div>;
  return children;
}

function AdminOnly({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <Private>
                <Layout />
              </Private>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="ativos" element={<Ativos />} />
            <Route path="manutencoes" element={<Manutencoes />} />
            <Route path="locais" element={<Locais />} />
            <Route
              path="usuarios"
              element={
                <AdminOnly>
                  <Usuarios />
                </AdminOnly>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
