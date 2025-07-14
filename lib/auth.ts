import { create } from "zustand"

export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: "client" | "operator" | "admin"
  createdAt: Date
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

export const mockLogin = (email: string, role: "client" | "operator" | "admin" = "client") => {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split("@")[0],
    role,
    createdAt: new Date(),
  }
  useAuth.getState().login(user)
  return user
}
