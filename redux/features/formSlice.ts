import { createSlice } from "@reduxjs/toolkit";

interface FormState {
  // form submit loading state
  isLoading: boolean;

  // url for image of random game to use as bg
  heroImage: string | null;

  // flag for showing error message
  showError: boolean;

  // game name user input
  gameInput: string;
}

const formSlice = createSlice({
  name: "form",
  initialState: {
    isLoading: false,
    heroImage: null,
    showError: false,
    gameInput: "",
  } as FormState,
  reducers: {
    setIsLoading: (state, action) => ({ ...state, isLoading: action.payload }),
    setHeroImage: (state, action) => ({ ...state, heroImage: action.payload }),
    setShowError: (state, action) => ({ ...state, showError: action.payload }),
    setGameInput: (state, action) => ({ ...state, gameInput: action.payload }),
  },
});

export const { setIsLoading, setHeroImage, setShowError, setGameInput } = formSlice.actions;
export default formSlice.reducer;
