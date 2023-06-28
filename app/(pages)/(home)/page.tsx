"use client";
import { useCallback, useEffect, useState } from "react";
import useAppStore from "utils/store";
import Form from "components/form/form";
import Response from "components/response";
import Image from "next/image";

export default function Home() {
  interface Game {
    name: string;
    platform: string;
    description: string;
    image?: string;
  }

  interface Recommendations {
    games: Game[];
    other: string[];
  }

  const test = 0;
  const testResult: Recommendations = {
    games: [
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
    ],
    other: ["Chrono Trigger", "Earthbound", "Dragon Quest"],
  };
  const [result, setResult] = useState<Recommendations | null>(null);
  const {
    pageReady,
    setIsLoading,
    setHeroImage,
    setPageReady,
    setShowError,
    setGameInput,
    gameInput,
    ageInput,
  } = useAppStore();

  // on load get random game to display image and name in form
  useEffect(() => {
    const getRandomGame = async () => {
      try {
        const response = await fetch("/api/randomGame");
        const data: Game = await response.json();
        setHeroImage(data.image);
        setGameInput(data.name);
        setPageReady(true);

        if (test) {
          setResult(testResult);
        }
      } catch (error: any) {
        // if error hardcode game and image
        setHeroImage("/supermariorpg.png");
        setGameInput("Super Mario RPG");
        setPageReady(true);
      }
    };

    getRandomGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // submit form data, use to generate prompt and submit to openai.
  // memoized to prevent recreation on re-render unless input changes.
  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, gameInput: string, ageInput: HTMLInputElement) => {
      event.preventDefault();

      // validate input
      if (gameInput.trim().length === 0) {
        return;
      }

      setIsLoading(true);
      setResult(null);
      setShowError(false);

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
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setShowError(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameInput, ageInput],
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
    <main className="main w-full flex flex-col items-center pb-20 bg-[#F5F5F5]">
      <div className={`flex flex-col justify-center items-center ${pageReady ? "mt-20" : "h-screen"}`}>
        {/* logo */}
        <Image priority src="/logo.png" alt="play what logo" width={130} height={130} />

        {/* title */}
        <h1 className="text-5xl -mt-5">playwhat</h1>
      </div>

      {/* form */}
      {pageReady && <Form onSubmit={onSubmit} />}

      {/* response */}
      {result && <Response result={result} />}
    </main>
  );
}
