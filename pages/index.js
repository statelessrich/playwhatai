import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useAppStore from "../lib/store";
import Form from "../components/form";
import Response from "../components/response";
import getRandomGame from "./api/randomGame";

// on load get random game data from server
export async function getServerSideProps() {
  const data = await getRandomGame();

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const test = 0;
  const testResult = {
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
  const [result, setResult] = useState(null);
  const {
    isLoading,
    pageReady,
    heroImage,
    setIsLoading,
    setHeroImage,
    setPageReady,
    setShowError,
    setGameInput,
  } = useAppStore();

  // set random game name and image from server props on page load
  useEffect(() => {
    setHeroImage(data?.image || "/supermariorpg.png");
    setGameInput(data?.name || "Super Mario RPG");
    setPageReady(true);

    if (test) {
      setResult(testResult);
    }
  }, []);

  // submit form data, use to generate prompt and submit to openai.
  // memoized to prevent recreation on re-render
  const onSubmit = useCallback(async (event, gameInput, ageInput) => {
    event.preventDefault();

    if (gameInput.trim().length === 0) {
      return;
    }

    setIsLoading(true);
    setResult("");
    setShowError(false);

    try {
      // submit openai prompt for recommended games
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameInput, age: ageInput.value }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const recommendedGames = data.games.map((game) => game.name);

      // submit openai prompt for game descriptions
      const descriptionResponse = await fetch("/api/descriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameInput, recommendedGames }),
      });

      const descriptions = await descriptionResponse.json();
      console.log(descriptions);

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // add descriptions to games object
      descriptions.forEach((description) => {
        const game = data.games.find((game) => game.name === description.name);
        if (game) {
          game.description = description.description;
        }
      });

      // replace new line characters
      // const formattedResult = JSON.parse(data.result.replace(/\n/g, ""));
      setResult(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setShowError(true);
    }
  });

  return (
    <div className="w-full">
      <div className={`flex flex-col justify-center items-center ${pageReady ? "mt-20" : "h-screen"}`}>
        {/* logo */}
        <Image priority src="/logo.png" alt="play what logo" width={130} height={130} />

        {/* title */}
        <h1 className="text-6xl -mt-5">playwhat</h1>
      </div>

      {/* form */}
      {pageReady && <Form onSubmit={onSubmit} heroImage={heroImage} isLoading={isLoading} />}

      {/* response */}
      {result && <Response result={result} />}
    </div>
  );
}
