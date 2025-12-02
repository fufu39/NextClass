import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  username: string
  role: string
  email: string
  expire?: string
  emailSubscription?: boolean
  avatar?: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      }
    }),
    {
      name: 'user-storage', // storage中的key
      partialize: (state) => ({
        user: state.user, // user包含email，此处会自动持久化
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useUserStore
