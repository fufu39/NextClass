import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CommonState {
  resetEmailEndTime: number
  setResetEmailEndTime: (time: number) => void
  registerEmailEndTime: number
  setRegisterEmailEndTime: (time: number) => void
}

export const useCommonStore = create<CommonState>()(
  persist(
    (set) => ({
      resetEmailEndTime: 0,
      setResetEmailEndTime: (time) => set({ resetEmailEndTime: time }),
      registerEmailEndTime: 0,
      setRegisterEmailEndTime: (time) => set({ registerEmailEndTime: time }),
    }),
    {
      name: 'common-storage',
    }
  )
)
