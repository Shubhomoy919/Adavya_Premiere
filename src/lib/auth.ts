export function getAdmin() {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  }
  
  export function requireAuth() {
    const admin = getAdmin();
    if (!admin) {
      window.location.href = "/login";
    }
  }
  
  export function requireRole(role: "main" | "admin") {
    const admin = getAdmin();
  
    if (!admin) {
      window.location.href = "/login";
      return;
    }
  
    if (admin.role !== role) {
      // normal admins go to points
      window.location.href = "/points";
    }
  }
  
  export function logout() {
    localStorage.removeItem("admin");
    window.location.href = "/login";
  }
  