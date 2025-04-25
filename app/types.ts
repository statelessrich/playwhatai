export interface Game {
  // api error
  error?: string;
  
  // game name
  name: string;

  // game platform (ps5, xbox, etc)
  platform: string;

  // game description (how is it similar to the user input game)
  description: string;

  // image of the game from RAWG api to us in background
  image?: string;
}

export interface FormState {
  // form submit loading state
  isLoading: boolean;

  // url for image of random game to use as bg
  heroImage: string | null;

  // flag for showing error message
  showError: boolean;

  // game name user input
  gameInput: string;
}

export interface HomeState {
  // data is loaded and page is ready to display
  pageReady: boolean;
}