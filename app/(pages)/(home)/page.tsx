"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import Form from "../../components/form/form";
import Response from "../../components/response";
import { setGameInput, setHeroImage, setIsLoading, setShowError } from "../../redux/features/formSlice";
import { setPageReady } from "../../redux/features/homeSlice";
import { RootState, store } from "../../redux/store";
import { Game } from "../../types";

// home page component to display form and response
export default function Home() {
  const test = 0;
  const testResult: Game[] = [
    {
      name: "Fallout 3",
      platform: "Super Nintendo Entertainment System (SNES)",
      description:
        "Paper Mario is a role-playing game similar to Mario RPG in that it follows the same general premise of Mario's adventures, but with a paper-based art style. Players have to explore levels and combat foes in order to progress. The game also has a variety of puzzles and mini-games to complete, just like in Mario RPG.",
    },
    {
      name: "Mario & Luigi: Superstar Saga",
      platform: "DS",
      description:
        "Mario & Luigi: Superstar Saga is another role-playing game in the Mario franchise that follows a similar format to Mario RPG. Players control Mario and Luigi as they explore various worlds and battle enemies. The game also features puzzles, mini-games and a turn-based combat system similar to Mario RPG.",
    },
  ];
  const [result, setResult] = useState<Game[] | null>(null);

  const dispatch = useDispatch();

  // state values
  const { pageReady } = useSelector((state: RootState) => state.home);
  const { gameInput } = useSelector((state: RootState) => state.form);

  // on load get random game to display image and name in form
  useEffect(() => {
    const getRandomGame = async () => {
      try {
        const response = await fetch("/api/randomGame");
        const data: Game = await response.json();
        dispatch(setHeroImage(data.image));
        dispatch(setGameInput(data.name));
        dispatch(setPageReady(true));

        if (test) {
          setResult(testResult);
        }
      } catch (error: any) {
        // if error hardcode game and image
        dispatch(setHeroImage("/supermariorpg.png"));
        dispatch(setGameInput("Super Mario RPG"));
        dispatch(setPageReady(true));
      }
    };

    getRandomGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // submit form data, use to generate prompt and submit to openai.
  // memoized to prevent recreation on re-render unless input changes.
  const onSubmit = useCallback(
    async (
      // event: React.FormEvent<HTMLFormElement>,
      // gameInput: string,
      // ageInput: HTMLInputElement
      data: any,
    ) => {
      // event.preventDefault();
      const { gameInput, ageInput } = data;

      // validate input
      if (gameInput.trim().length === 0) {
        return;
      }

      dispatch(setIsLoading(true));
      setResult(null);
      dispatch(setShowError(false));

      try {
        // get recommended games from openai
        const response = await fetch("/api/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ game: gameInput, age: ageInput.value }),
        });

        const { games } = await response.json();

        if (response.status !== 200) {
          throw games.error || new Error(`Request failed with status ${response.status}`);
        }

        const recommendedGameNames = games.map((game: any) => game.name);

        // wait for all game descriptions to be fetched before updating state
        await Promise.all(
          recommendedGameNames.map(async (game: any) => {
            const description = await getGameDescription(gameInput, game);
            games.find((_game: any) => _game.name === game).description = description;
          }),
        );

        setResult(games);
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
        dispatch(setShowError(true));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameInput],
  );

  // get game description from openai. because vercel's hobby tier has a 10s api call timeout, sometimes the call fails. so, we retry a few times before giving up and displaying an error message.
  async function getGameDescription(game: string, recommendedGame: string) {
    let retries = 4;

    while (retries >= 0) {
      try {
        // submit openai prompt for game description
        const response = await fetch("/api/description", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ game, recommendedGame }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const description = await response.json();
        return description;
      } catch (error) {
        // try again
        retries--;
      }
    }

    throw new Error("An error occurred while fetching game description.");
  }

  return (
    <Provider store={store}>
      <main className="main w-full flex flex-col items-center pb-20 bg-[#F5F5F5]">
        <div className={`flex flex-col justify-center items-center ${pageReady ? "mt-20" : "h-screen"}`}>
          {/* logo */}
          <Image priority src="/logo.png" alt="play what logo" width={130} height={130} />

          {/* title */}
          <h1 className="text-5xl -mt-5">playwhat</h1>
        </div>

        {/* form */}
        {pageReady && <Form submitForm={onSubmit} />}

        {/* response */}
        {result && <Response games={result} />}
      </main>
    </Provider>
  );
}
