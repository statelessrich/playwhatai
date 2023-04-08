import { create } from "zustand";

const useAppStore = create((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  pageReady: false,
  setPageReady: (pageReady) => set({ pageReady }),
  heroImage: null,
  setHeroImage: (heroImage) => set({ heroImage }),
  showError: false,
  setShowError: (showError) => set({ showError }),
  gameInput: "",
  setGameInput: (gameInput) => set({ gameInput }),
}));

export default useAppStore;
