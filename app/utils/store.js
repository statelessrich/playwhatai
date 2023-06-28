import { create } from "zustand";


// create store to hold app data
const useAppStore = create((set) => ({
  // form submit loading state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // app ready after page load state
  pageReady: false,
  setPageReady: (pageReady) => set({ pageReady }),

  // url for image of random game to use as bg
  heroImage: null,
  setHeroImage: (heroImage) => set({ heroImage }),

  // flag for showing error message
  showError: false,
  setShowError: (showError) => set({ showError }),

  // user input of game name
  gameInput: "",
  setGameInput: (gameInput) => set({ gameInput }),
}));

export default useAppStore;


