import { create } from "zustand";
import { clearAuthToken, getAuthToken, setAuthToken as persistAuthToken } from "@/shared/lib/storage";

interface AuthState {
  email: string;
  authToken: string | null;
  setEmail: (email: string) => void;
  setAuthToken: (token: string) => void;
  clearSession: () => void;
  hydrateAuthToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  authToken: null,
  setEmail: (email) => set({ email }),
  setAuthToken: (token) => {
    persistAuthToken(token);
    set({ authToken: token });
  },
  clearSession: () => {
    clearAuthToken();
    set({ authToken: null, email: "" });
  },
  hydrateAuthToken: () => {
    const token = getAuthToken();
    set({ authToken: token });
  },
}));
