import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  if (!configuration.apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message: "An error occurred during your request.",
        },
      }),
    );
  }

  const { game, age } = await request.json();

  // validate input
  if (game.trim().length === 0) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Missing game",
        },
      }),
      { status: 400 },
    );
  }

  try {
    const test = 0;

    if (test) {
      return new Response(
        JSON.stringify({
          games: [
            { name: "Fallout 3", platform: "Super Nintendo Entertainment System (SNES)" },
            { name: "Mario & Luigi: Superstar Saga", platform: "DS" },
          ],
        }),
      );
    }

    // get recommended games from openai
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getGamesPrompt(game, age),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const recommendedGames = JSON.parse(completion.data.choices[0].text || "");
    return new Response(JSON.stringify(recommendedGames));
  } catch (error: any) {
    // catch error and return error message
    if (error.response) {
      console.error(error.response.status, error.response.data);

      return new Response(
        JSON.stringify({
          error: {
            message: error.response.data,
          },
        }),
        { status: error.response.status },
      );
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);

      return new Response(
        JSON.stringify({
          error: {
            message: "An error occurred during your request.",
          },
        }),
        { status: 500 },
      );
    }
  }
}

function getGamesPrompt(game: string, age: string) {
  // optionally get list of 3 other game recommendations
  const withOther = 0;

  const prompt = `Suggest 2 video games that are most similar to ${game} that have a release date ${
    age === "retro" ? "before 2005" : "after 2004"
  }. Give results in a javascript object like this: {"games":[{"name": "[name of game]", "platform":"[platform game is available on]"}]}.
  
  example response:{"games":[{"name": "<name>","platform":"<platform>"}]}
`;

  return prompt;
}

//  and for each provide the platform and a paragraph explaining why it's similar
// ${
//     withOther ? "Then suggest a list of the 3 next most similar games." : ""
//   }
//  "description": "[description of how game is similar to ${game}]"
// ${
//     withOther ? ', "other": [array of 3 other similar games]' : ""
//   }
// , "description": "<description>"
// ${withOther ? ',"other":["<other1>","<other2>","<other3>"]`:""}

// Game: Grand Theft Auto III
// Similar games:
// {games: [{name:"Grand Theft Auto: Vice City",description:"another game in the series"}, {name:"Grand Theft Auto IV",description:"another game in the series"}, {name:"Saint's Row",description:"a game directly inspired by GTA"}]}
// Game: Super Mario Bros.
// Similar Games:
// {games: [{name:"Super Mario World",description:"another game in the series"}, {name:"Wario Land",description:"another game in the series"}, {name:"Donkey Kong Country",description:"another game in the series"}]}
// Game: ${game}
// Similar Games:;
