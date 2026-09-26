import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/auth";
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  setUserRole,
  removeUserRole,
} from "@/lib/cookies";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (partialUser: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isHydrated: false,

      login: (user, token) => {
        // Token and role are stored in Cookies
        setAuthToken(token);
        if (user?.role) {
          setUserRole(user.role);
        }
        set({
          user,
          token,
          isLoggedIn: true,
        });
      },

      logout: () => {
        // Remove token and role from Cookies
        removeAuthToken();
        removeUserRole();
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
      },

      updateUser: (partialUser) => {
        if (partialUser.role) {
          setUserRole(partialUser.role);
        }
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        }));
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "revofashion_auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive profile state to localStorage.
      // The token is EXCLUDED and saved ONLY in Cookies.
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        // Read token strictly from Cookies
        const cookieToken = getAuthToken();
        if (cookieToken && state?.user) {
          state.token = cookieToken;
          state.isLoggedIn = true;
          if (state.user.role) {
            setUserRole(state.user.role);
          }
        } else if (state) {
          // If no token exists in Cookies (or expired), clear auth state
          removeUserRole();
          state.token = null;
          state.user = null;
          state.isLoggedIn = false;
        }
        state?.setHydrated(true);
      },
    }
  )
);
