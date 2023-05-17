import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  const game = req.body.game || "";
  const age = req.body.age || "";

  // validate input
  if (game.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Missing game",
      },
    });
    return;
  }

  try {
    const test = 0;

    if (test) {
      res.status(200).json({
        games: [
          { name: "Fallout 3", platform: "Super Nintendo Entertainment System (SNES)" },
          { name: "Mario & Luigi: Superstar Saga", platform: "DS" },
        ],
      });
      return;
    }

    // get recommended games from openai
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getGamesPrompt(game, age),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const recommendedGames = JSON.parse(completion.data.choices[0].text);
    res.status(200).json(recommendedGames);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function getGamesPrompt(game, age) {
  // optionally get list of 3 other game recommendations
  const withOther = 0;

  const prompt = `Suggest 3 video games that are most similar to ${game} that have a release date ${age === 'retro' ? 'before 2005':'after 2004'}. Give results in a javascript object like this: {"games":[{"name": "[name of game]", "platform":"[platform game is available on]"}]}.
  
  example response:{"games":[{"name": "<name>","platform":"<platform>"}]}
`;

  console.log(`prompt: ${prompt}`);
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
