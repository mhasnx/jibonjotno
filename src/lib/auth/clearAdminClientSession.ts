export function clearAdminClientSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("jj_admin_session");
    localStorage.removeItem("admin_authenticated");
  } catch {
    // ignore storage errors
  }
  document.cookie = "admin_token=; path=/; max-age=0; SameSite=Strict";
}

export async function logoutAdminSession() {
  clearAdminClientSession();
  try {
    await fetch("/api/auth/session", { method: "DELETE", credentials: "include" });
  } catch {
    // Cookie clearing still happens via the API when reachable.
  }
}
