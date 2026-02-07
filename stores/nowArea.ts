// nowArea.ts
'use client'

import { create } from 'zustand'

export interface NowAreaType {
  nowArea: string
  setNowArea: (newArea: string) => void
}

export const useNowArea = create<NowAreaType>((set) => ({
  nowArea: 'middleArea',
  setNowArea: (newArea: string) => set({ nowArea: newArea }),
}))
