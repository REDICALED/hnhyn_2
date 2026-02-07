// BeforeArea.ts
'use client'

import { create } from 'zustand'

export interface BeforeAreaType {
  beforeArea: string
  setBeforeArea: (newArea: string) => void
}

export const useBeforeArea = create<BeforeAreaType>((set) => ({
  beforeArea: 'middleArea',
  setBeforeArea: (newArea: string) => set({ beforeArea: newArea }),
}))
