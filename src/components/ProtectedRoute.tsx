import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactElement;
  requireRole?: "USER" | "ADMIN" | "SUPER";
}

export default function ProtectedRoute({ children, requireRole }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!requireRole) return children;

  // USER pode ver tudo que é de USER
  if (requireRole === "USER") return children;

  // ADMIN pode ver tudo de USER e ADMIN
  if (requireRole === "ADMIN" && (user.tipoUsuario === "ADMIN" || user.tipoUsuario === "SUPER"))
    return children;

  // SUPER pode ver tudo
  if (requireRole === "SUPER" && user.tipoUsuario === "SUPER")
    return children;

  return <Navigate to="/" replace />;
}
