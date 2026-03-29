import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, BodyData, ClothingItem, Outfit } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface BodyDataState {
  bodyData: BodyData | null;
  setBodyData: (data: BodyData | null) => void;
}

export const useBodyDataStore = create<BodyDataState>()(
  persist(
    (set) => ({
      bodyData: null,
      setBodyData: (bodyData) => set({ bodyData }),
    }),
    {
      name: 'body-data-storage',
    }
  )
);

interface WardrobeState {
  clothing: ClothingItem[];
  setClothing: (clothing: ClothingItem[]) => void;
  addClothing: (item: ClothingItem) => void;
  updateClothing: (id: number, data: Partial<ClothingItem>) => void;
  removeClothing: (id: number) => void;
}

export const useWardrobeStore = create<WardrobeState>()((set) => ({
  clothing: [],
  setClothing: (clothing) => set({ clothing }),
  addClothing: (item) => set((state) => ({ clothing: [...state.clothing, item] })),
  updateClothing: (id, data) =>
    set((state) => ({
      clothing: state.clothing.map((item) => (item.id === id ? { ...item, ...data } : item)),
    })),
  removeClothing: (id) =>
    set((state) => ({ clothing: state.clothing.filter((item) => item.id !== id) })),
}));

interface OutfitState {
  outfits: Outfit[];
  setOutfits: (outfits: Outfit[]) => void;
  addOutfit: (outfit: Outfit) => void;
  updateOutfit: (id: number, data: Partial<Outfit>) => void;
  removeOutfit: (id: number) => void;
}

export const useOutfitStore = create<OutfitState>()((set) => ({
  outfits: [],
  setOutfits: (outfits) => set({ outfits }),
  addOutfit: (outfit) => set((state) => ({ outfits: [...state.outfits, outfit] })),
  updateOutfit: (id, data) =>
    set((state) => ({
      outfits: state.outfits.map((outfit) => (outfit.id === id ? { ...outfit, ...data } : outfit)),
    })),
  removeOutfit: (id) =>
    set((state) => ({ outfits: state.outfits.filter((outfit) => outfit.id !== id) })),
}));
