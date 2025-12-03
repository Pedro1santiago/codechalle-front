// Gerenciamento de solicitações de admin no localStorage

const SOLICITATION_KEY = "codechella_admin_solicitation";

interface AdminSolicitation {
  userId: number;
  userName: string;
  status: "PENDENTE" | "APROVADA" | "NEGADA";
  requestedAt: string;
  lastChecked?: string;
}

// Salvar solicitação
export function saveSolicitation(userId: number, userName: string): void {
  try {
    const solicitation: AdminSolicitation = {
      userId,
      userName,
      status: "PENDENTE",
      requestedAt: new Date().toISOString()
    };
    localStorage.setItem(SOLICITATION_KEY, JSON.stringify(solicitation));
  } catch (error) {
    // Error handled silently
  }
}

// Obter solicitação
export function getSolicitation(): AdminSolicitation | null {
  try {
    const data = localStorage.getItem(SOLICITATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

// Atualizar status da solicitação
export function updateSolicitationStatus(status: "PENDENTE" | "APROVADA" | "NEGADA"): void {
  try {
    const solicitation = getSolicitation();
    if (solicitation) {
      solicitation.status = status;
      solicitation.lastChecked = new Date().toISOString();
      localStorage.setItem(SOLICITATION_KEY, JSON.stringify(solicitation));
    }
  } catch (error) {
    // Error handled silently
  }
}

// Limpar solicitação
export function clearSolicitation(): void {
  try {
    localStorage.removeItem(SOLICITATION_KEY);
  } catch (error) {
    // Error handled silently
  }
}

// Verificar se tem solicitação pendente
export function hasPendingSolicitation(userId: number): boolean {
  const solicitation = getSolicitation();
  return solicitation !== null && 
         solicitation.userId === userId && 
         solicitation.status === "PENDENTE";
}
